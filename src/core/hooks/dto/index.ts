import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHookDto {
  @ApiProperty({ description: 'Hook name', example: 'article.beforeSave' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Hook description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Is system hook' })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}

export class RegisterListenerDto {
  @ApiProperty({ description: 'Hook name to listen to' })
  @IsString()
  hookName: string;

  @ApiProperty({ description: 'Module slug' })
  @IsString()
  moduleSlug: string;

  @ApiProperty({ description: 'Handler function name' })
  @IsString()
  handler: string;

  @ApiPropertyOptional({ description: 'Priority (lower = earlier)', default: 10 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: 'Is listener enabled' })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

export class UpdateListenerDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
