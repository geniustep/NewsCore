import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMediaDto {
  @ApiPropertyOptional({ example: 'وصف الصورة' })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  alt?: string;

  @ApiPropertyOptional({ example: 'تعليق على الصورة' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ example: 'المصور أحمد' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  credit?: string;

  @ApiPropertyOptional()
  @IsUUID('4')
  @IsOptional()
  folderId?: string;
}

