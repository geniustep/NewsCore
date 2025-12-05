import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ArticleStatusEnum, ArticleTypeEnum } from './create-article.dto';

export class ArticleQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ArticleStatusEnum })
  @IsEnum(ArticleStatusEnum)
  @IsOptional()
  status?: ArticleStatusEnum;

  @ApiPropertyOptional({ enum: ArticleTypeEnum })
  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  type?: ArticleTypeEnum;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  tagId?: string;

  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isBreaking?: boolean;

  @ApiPropertyOptional({ description: 'Filter scheduled articles' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  scheduled?: boolean;

  @ApiPropertyOptional({ enum: ['createdAt', 'publishedAt', 'title', 'viewsTotal', 'viewCount', 'scheduledAt'] })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

