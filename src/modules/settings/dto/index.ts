import { IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsObject()
  value: any;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateSettingDto {
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  value?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class ThemeSettingsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoAr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoFr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  textColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fontSize?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  headingFont?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  borderRadius?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  spacing?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  darkModeEnabled?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  darkPrimaryColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  darkBackgroundColor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  darkTextColor?: string;
}

