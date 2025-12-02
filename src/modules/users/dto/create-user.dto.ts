import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsUUID,
  IsEnum,
} from 'class-validator';

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@sahara2797.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  password: string;

  @ApiProperty({ example: 'أحمد' })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'محمد' })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: '+212600000000' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ enum: UserStatusEnum, default: UserStatusEnum.ACTIVE })
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum = UserStatusEnum.ACTIVE;

  @ApiPropertyOptional({ type: [String], example: ['editor'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}

