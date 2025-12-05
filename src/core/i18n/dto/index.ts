import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  IsObject, 
  IsEnum,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// LANGUAGE DTOs
// ============================================

export class CreateLanguageDto {
  @ApiProperty({ description: 'Language code (e.g., ar, en, fr)', example: 'es' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/^[a-z]{2}(-[A-Z]{2})?$/, { message: 'Invalid language code format' })
  code: string;

  @ApiProperty({ description: 'Language name in English', example: 'Spanish' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Language name in native language', example: 'Español' })
  @IsString()
  @MaxLength(100)
  nativeName: string;

  @ApiProperty({ description: 'Text direction', enum: ['ltr', 'rtl'] })
  @IsString()
  direction: 'ltr' | 'rtl';

  @ApiPropertyOptional({ description: 'Flag emoji', example: '🇪🇸' })
  @IsString()
  @IsOptional()
  flag?: string;

  @ApiPropertyOptional({ description: 'Is language active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is default language' })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Is fallback language' })
  @IsBoolean()
  @IsOptional()
  isFallback?: boolean;

  @ApiPropertyOptional({ description: 'Date format', example: 'DD/MM/YYYY' })
  @IsString()
  @IsOptional()
  dateFormat?: string;

  @ApiPropertyOptional({ description: 'Time format', example: 'HH:mm' })
  @IsString()
  @IsOptional()
  timeFormat?: string;

  @ApiPropertyOptional({ description: 'Timezone', example: 'Europe/Madrid' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Number format settings' })
  @IsObject()
  @IsOptional()
  numberFormat?: { decimal: string; thousand: string; precision?: number };

  @ApiPropertyOptional({ description: 'Currency code', example: 'EUR' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Locale code', example: 'es_ES' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ description: 'Hreflang value', example: 'es' })
  @IsString()
  @IsOptional()
  hreflang?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateLanguageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nativeName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  direction?: 'ltr' | 'rtl';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  flag?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dateFormat?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timeFormat?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class LanguageQueryDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// ============================================
// NAMESPACE DTOs
// ============================================

export class CreateNamespaceDto {
  @ApiProperty({ description: 'Namespace name', example: 'common' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Namespace description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Is system namespace' })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @ApiPropertyOptional({ description: 'Associated module slug' })
  @IsString()
  @IsOptional()
  moduleSlug?: string;

  @ApiPropertyOptional({ description: 'Associated theme slug' })
  @IsString()
  @IsOptional()
  themeSlug?: string;
}

export class UpdateNamespaceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

// ============================================
// TRANSLATION DTOs
// ============================================

export class CreateTranslationDto {
  @ApiProperty({ description: 'Translation key', example: 'nav.home' })
  @IsString()
  @MaxLength(255)
  key: string;

  @ApiProperty({ description: 'Translation value' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'Language code', example: 'ar' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Namespace name', example: 'common' })
  @IsString()
  namespace: string;

  @ApiPropertyOptional({ description: 'Context for translators' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiPropertyOptional({ description: 'Plural forms' })
  @IsObject()
  @IsOptional()
  pluralForms?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Is auto-translated' })
  @IsBoolean()
  @IsOptional()
  isAuto?: boolean;
}

export class UpdateTranslationDto {
  @ApiProperty({ description: 'Translation value' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Context for translators' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiPropertyOptional({ description: 'Plural forms' })
  @IsObject()
  @IsOptional()
  pluralForms?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Is reviewed' })
  @IsBoolean()
  @IsOptional()
  isReviewed?: boolean;
}

export class BulkCreateTranslationsDto {
  @ApiProperty({ description: 'Namespace name' })
  @IsString()
  namespace: string;

  @ApiProperty({ description: 'Language code' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Translations object' })
  @IsObject()
  translations: Record<string, string>;
}

export class TranslationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  namespace?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isReviewed?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAuto?: boolean;
}

// ============================================
// IMPORT/EXPORT DTOs
// ============================================

export class ImportTranslationsDto {
  @ApiProperty({ description: 'Namespace name' })
  @IsString()
  namespace: string;

  @ApiProperty({ description: 'Language code' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Translations data' })
  @IsObject()
  data: Record<string, string>;

  @ApiPropertyOptional({ description: 'Overwrite existing translations' })
  @IsBoolean()
  @IsOptional()
  overwrite?: boolean;
}

export class ExportTranslationsDto {
  @ApiPropertyOptional({ description: 'Language code (all if not specified)' })
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiPropertyOptional({ description: 'Namespace (all if not specified)' })
  @IsString()
  @IsOptional()
  namespace?: string;

  @ApiProperty({ description: 'Export format', enum: ['json', 'csv', 'po'] })
  @IsString()
  format: 'json' | 'csv' | 'po';
}

// ============================================
// AI TRANSLATION DTOs
// ============================================

export class AITranslateDto {
  @ApiProperty({ description: 'Text to translate' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Source language code' })
  @IsString()
  sourceLanguage: string;

  @ApiProperty({ description: 'Target language code' })
  @IsString()
  targetLanguage: string;

  @ApiPropertyOptional({ description: 'Context for better translation' })
  @IsString()
  @IsOptional()
  context?: string;
}

export class BulkAITranslateDto {
  @ApiProperty({ description: 'Namespace to translate' })
  @IsString()
  namespace: string;

  @ApiProperty({ description: 'Source language code' })
  @IsString()
  sourceLanguage: string;

  @ApiProperty({ description: 'Target language code' })
  @IsString()
  targetLanguage: string;

  @ApiPropertyOptional({ description: 'Only translate missing keys' })
  @IsBoolean()
  @IsOptional()
  onlyMissing?: boolean;
}
