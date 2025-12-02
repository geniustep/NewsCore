import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@sahara2797.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم',
  })
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
}

