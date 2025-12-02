import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { LoginDto, RegisterDto, AuthResponseDto, TokensDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    // Hash password
    const passwordHash = await CryptoUtil.hashPassword(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        phone: dto.phone,
        status: 'ACTIVE',
      },
    });

    // Assign default role (editor)
    const editorRole = await this.prisma.role.findUnique({
      where: { name: 'editor' },
    });

    if (editorRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: editorRole.id,
        },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, ['editor']);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName || `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        roles: ['editor'],
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('الحساب غير نشط');
    }

    const isPasswordValid = await CryptoUtil.comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const roles = user.roles.map((ur) => ur.role.name);
    const tokens = await this.generateTokens(user.id, user.email, roles);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName || `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        roles,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('جلسة غير صالحة');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('الحساب غير نشط');
    }

    const roles = session.user.roles.map((ur) => ur.role.name);
    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      roles,
    );

    // Revoke old session and create new one
    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    await this.createSession(session.user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.prisma.session.updateMany({
        where: { userId, refreshToken },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all sessions
      await this.prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        preferences: true,
      },
    });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.name),
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      phone: user.phone,
      locale: user.locale,
      timezone: user.timezone,
      roles,
      permissions: [...new Set(permissions)],
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<TokensDto> {
    const payload = { sub: userId, email, roles };

    const accessExpiration = this.configService.get<string>(
      'jwt.accessExpiration',
      '15m',
    );
    const refreshExpiration = this.configService.get<string>(
      'jwt.refreshExpiration',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: accessExpiration }),
      this.jwtService.signAsync(payload, { expiresIn: refreshExpiration }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiration(accessExpiration),
    };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshExpiration = this.configService.get<string>(
      'jwt.refreshExpiration',
      '7d',
    );
    const expiresAt = new Date(
      Date.now() + this.parseExpiration(refreshExpiration) * 1000,
    );

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
      },
    });
  }

  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900;
    }
  }
}

