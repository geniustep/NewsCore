import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsUUID,
  IsEnum,
  MaxLength,
  IsDateString,
} from 'class-validator';

export enum ArticleStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
}

export enum ArticleTypeEnum {
  STANDARD = 'STANDARD',
  BREAKING = 'BREAKING',
  ANALYSIS = 'ANALYSIS',
  OPINION = 'OPINION',
  INVESTIGATION = 'INVESTIGATION',
  INTERVIEW = 'INTERVIEW',
  VIDEO = 'VIDEO',
  PHOTO_STORY = 'PHOTO_STORY',
}

export class CreateArticleDto {
  @ApiProperty({ example: 'عنوان المقال الإخباري' })
  @IsString()
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({ example: 'عنوان فرعي للمقال' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  subtitle?: string;

  @ApiPropertyOptional({ example: 'ملخص قصير للمقال' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ example: 'محتوى المقال الكامل...' })
  @IsString()
  @IsNotEmpty({ message: 'المحتوى مطلوب' })
  content: string;

  @ApiPropertyOptional({ example: '<p>محتوى HTML</p>' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ enum: ArticleStatusEnum, default: ArticleStatusEnum.DRAFT })
  @IsEnum(ArticleStatusEnum)
  @IsOptional()
  status?: ArticleStatusEnum = ArticleStatusEnum.DRAFT;

  @ApiPropertyOptional({ enum: ArticleTypeEnum, default: ArticleTypeEnum.STANDARD })
  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  type?: ArticleTypeEnum = ArticleTypeEnum.STANDARD;

  @ApiPropertyOptional({ example: 'ar', default: 'ar' })
  @IsString()
  @IsOptional()
  language?: string = 'ar';

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiPropertyOptional({ example: 'وصف الصورة' })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  coverImageAlt?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isBreaking?: boolean = false;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allowComments?: boolean = true;

  @ApiPropertyOptional({ example: 'عنوان SEO' })
  @IsString()
  @IsOptional()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'وصف SEO للمقال' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  seoDescription?: string;

  @ApiPropertyOptional({ type: [String], example: ['أخبار', 'سياسة'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];

  @ApiPropertyOptional({ type: [String], example: ['uuid1', 'uuid2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ type: [String], example: ['uuid1', 'uuid2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tagIds?: string[];

  @ApiPropertyOptional({ example: 'uuid-of-primary-category' })
  @IsUUID('4')
  @IsOptional()
  primaryCategoryId?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}

