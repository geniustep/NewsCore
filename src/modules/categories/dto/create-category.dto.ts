import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'سياسة' })
  @IsString()
  @IsNotEmpty({ message: 'اسم التصنيف مطلوب' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'سياسة' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameAr?: string;

  @ApiPropertyOptional({ example: 'Politics' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Politique' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameFr?: string;

  @ApiPropertyOptional({ example: 'أخبار سياسية محلية ودولية' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#FF5733' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ example: 'politics' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ example: 'عنوان SEO' })
  @IsString()
  @IsOptional()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'وصف SEO' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  seoDescription?: string;
}

