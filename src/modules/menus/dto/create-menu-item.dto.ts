import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsUUID,
  MaxLength,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';

export enum MenuItemTypeEnum {
  CUSTOM = 'CUSTOM',
  CATEGORY = 'CATEGORY',
  TAG = 'TAG',
  ARTICLE = 'ARTICLE',
  PAGE = 'PAGE',
  DIVIDER = 'DIVIDER',
  HEADING = 'HEADING',
  DYNAMIC = 'DYNAMIC',
}

export class CreateMenuItemDto {
  @ApiProperty({ example: 'الرئيسية' })
  @IsString()
  @IsNotEmpty({ message: 'التسمية مطلوبة' })
  @MaxLength(200)
  label: string;

  @ApiPropertyOptional({ example: 'Home' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  labelEn?: string;

  @ApiPropertyOptional({ example: 'Accueil' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  labelFr?: string;

  @ApiPropertyOptional({ example: 'الرئيسية' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  labelAr?: string;

  @ApiProperty({ enum: MenuItemTypeEnum, default: MenuItemTypeEnum.CUSTOM })
  @IsEnum(MenuItemTypeEnum)
  type: MenuItemTypeEnum = MenuItemTypeEnum.CUSTOM;

  @ApiPropertyOptional({ example: 'uuid-of-parent-item' })
  @IsUUID('4')
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @ValidateIf((o) => o.type === MenuItemTypeEnum.CUSTOM)
  url?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsUUID('4')
  @IsOptional()
  @ValidateIf((o) => o.type === MenuItemTypeEnum.CATEGORY)
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-tag' })
  @IsUUID('4')
  @IsOptional()
  @ValidateIf((o) => o.type === MenuItemTypeEnum.TAG)
  tagId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-article' })
  @IsUUID('4')
  @IsOptional()
  @ValidateIf((o) => o.type === MenuItemTypeEnum.ARTICLE)
  articleId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-page' })
  @IsUUID('4')
  @IsOptional()
  @ValidateIf((o) => o.type === MenuItemTypeEnum.PAGE)
  pageId?: string;

  @ApiPropertyOptional({ example: '_self' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  target?: string;

  @ApiPropertyOptional({ example: 'home-icon' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  icon?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'وصف العنصر' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'custom-class' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  cssClass?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isMegaMenu?: boolean = false;

  @ApiPropertyOptional({ example: 'grid-3' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  megaMenuLayout?: string;

  @ApiPropertyOptional()
  @IsOptional()
  megaMenuContent?: any;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  showOnMobile?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  showOnDesktop?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  displayConditions?: any;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({ example: 'عنوان SEO' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'وصف SEO' })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  seoDescription?: string;
}

