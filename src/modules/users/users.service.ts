import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await CryptoUtil.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        phone: dto.phone,
        status: dto.status || 'ACTIVE',
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Assign roles if provided
    if (dto.roleIds && dto.roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: dto.roleIds.map((roleId) => ({
          userId: user.id,
          roleId,
        })),
      });
    }

    return this.findOne(user.id);
  }

  async findAll(query: UserQueryDto) {
    const where: any = {
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.role) {
      where.roles = {
        some: {
          role: {
            name: query.role,
          },
        },
      };
    }

    const orderBy: any = {};
    orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.formatUser(user)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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

    if (!user || user.deletedAt) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return this.formatUserWithPermissions(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    // Check email uniqueness if changing
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingUser) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    const updateData: any = {
      ...(dto.email && { email: dto.email.toLowerCase() }),
      ...(dto.firstName && { firstName: dto.firstName }),
      ...(dto.lastName && { lastName: dto.lastName }),
      ...(dto.displayName && { displayName: dto.displayName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      ...(dto.status && { status: dto.status }),
    };

    if (dto.password) {
      updateData.passwordHash = await CryptoUtil.hashPassword(dto.password);
    }

    await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update roles if provided
    if (dto.roleIds !== undefined) {
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      if (dto.roleIds.length > 0) {
        await this.prisma.userRole.createMany({
          data: dto.roleIds.map((roleId) => ({
            userId: id,
            roleId,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });

    return { message: 'تم حذف المستخدم بنجاح' };
  }

  private formatUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      status: user.status,
      roles: user.roles?.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
        displayName: ur.role.displayName,
      })),
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  private formatUserWithPermissions(user: any) {
    const roles = user.roles?.map((ur: any) => ur.role.name) || [];
    const permissions = user.roles?.flatMap((ur: any) =>
      ur.role.permissions.map((rp: any) => rp.permission.name),
    ) || [];

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
      status: user.status,
      roles: user.roles?.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
        displayName: ur.role.displayName,
      })),
      permissions: [...new Set(permissions)],
      preferences: user.preferences,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

