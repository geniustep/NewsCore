import { IsString, IsBoolean, IsOptional, IsArray, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ModuleType {
  CORE = 'CORE',
  EXTENSION = 'EXTENSION',
  WIDGET = 'WIDGET',
  INTEGRATION = 'INTEGRATION',
}

export class InstallModuleDto {
  @ApiProperty({ description: 'Path to module directory or URL' })
  @IsString()
  source: string;

  @ApiPropertyOptional({ description: 'Enable module after installation' })
  @IsBoolean()
  @IsOptional()
  enable?: boolean;
}

export class CreateModuleDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  version: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ enum: ModuleType })
  @IsEnum(ModuleType)
  type: ModuleType;

  @ApiProperty()
  @IsObject()
  manifest: Record<string, any>;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  dependencies?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCore?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}

export class UpdateModuleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  manifest?: Record<string, any>;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

export class UpdateModuleSettingsDto {
  @ApiProperty({ description: 'Module settings key-value pairs' })
  @IsObject()
  settings: Record<string, any>;
}

export class ModuleQueryDto {
  @ApiPropertyOptional({ enum: ModuleType })
  @IsEnum(ModuleType)
  @IsOptional()
  type?: ModuleType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCore?: boolean;
}

export class RegisterHookDto {
  @ApiProperty()
  @IsString()
  hookName: string;

  @ApiProperty()
  @IsString()
  moduleSlug: string;

  @ApiProperty()
  @IsString()
  handler: string;

  @ApiPropertyOptional()
  @IsOptional()
  priority?: number;
}
