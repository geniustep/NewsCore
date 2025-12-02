import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatarUrl: string | null;
    roles: string[];
  };

  @ApiProperty()
  tokens: TokensDto;
}

