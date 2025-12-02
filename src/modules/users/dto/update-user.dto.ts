import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserStatusEnum } from './create-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@sahara2797.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsString()
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'أحمد' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمد' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'أحمد محمد' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ example: '+212600000000' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: UserStatusEnum })
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}

