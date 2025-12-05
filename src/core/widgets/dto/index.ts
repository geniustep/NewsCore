import { IsString, IsBoolean, IsOptional, IsObject, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWidgetDto {
  @ApiProperty({ description: 'Widget slug', example: 'recent-articles' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Widget name', example: 'Recent Articles' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Widget description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Widget type', example: 'articles' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Widget content/configuration' })
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Display region', example: 'sidebar' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ description: 'Position order' })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({ description: 'Is widget active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Show on mobile' })
  @IsBoolean()
  @IsOptional()
  showOnMobile?: boolean;

  @ApiPropertyOptional({ description: 'Show on desktop' })
  @IsBoolean()
  @IsOptional()
  showOnDesktop?: boolean;

  @ApiPropertyOptional({ description: 'Display conditions' })
  @IsObject()
  @IsOptional()
  displayConditions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'CSS class' })
  @IsString()
  @IsOptional()
  cssClass?: string;

  @ApiPropertyOptional({ description: 'Custom CSS' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: 'Enable caching' })
  @IsBoolean()
  @IsOptional()
  cacheEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Cache TTL in seconds' })
  @IsNumber()
  @IsOptional()
  cacheTtl?: number;
}

export class UpdateWidgetDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  showOnMobile?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  showOnDesktop?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  displayConditions?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cssClass?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  cacheEnabled?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cacheTtl?: number;
}

export class WidgetQueryDto {
  @ApiPropertyOptional({ description: 'Filter by region' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ description: 'Filter by type' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ReorderWidgetsDto {
  @ApiProperty({ description: 'Array of widget IDs in new order' })
  @IsString({ each: true })
  widgetIds: string[];

  @ApiProperty({ description: 'Region name' })
  @IsString()
  region: string;
}
