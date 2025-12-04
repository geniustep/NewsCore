import { IsString, IsOptional, IsBoolean, IsEnum, MaxLength, MinLength } from 'class-validator';

export enum TranslationTypeEnum {
  MANUAL = 'MANUAL',
  AI_GENERATED = 'AI_GENERATED',
  AI_ASSISTED = 'AI_ASSISTED',
}

export class CreatePageTranslationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  language: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @IsOptional()
  @IsEnum(TranslationTypeEnum)
  translationType?: TranslationTypeEnum;
}

export class UpdatePageTranslationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @IsOptional()
  @IsBoolean()
  isReviewed?: boolean;
}

