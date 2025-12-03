import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'القائمة الرئيسية' })
  @IsString()
  @IsNotEmpty({ message: 'اسم القائمة مطلوب' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'main-menu' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({ example: 'القائمة الرئيسية للموقع' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: 'custom-class' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  cssClass?: string;

  @ApiPropertyOptional({ example: 'default' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  theme?: string;
}

