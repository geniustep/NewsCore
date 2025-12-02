import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  MaxLength,
} from 'class-validator';

export enum TagTypeEnum {
  GENERAL = 'GENERAL',
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
  LOCATION = 'LOCATION',
  EVENT = 'EVENT',
  TOPIC = 'TOPIC',
}

export class CreateTagDto {
  @ApiProperty({ example: 'الانتخابات' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الوسم مطلوب' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'الانتخابات' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameAr?: string;

  @ApiPropertyOptional({ example: 'Elections' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Élections' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameFr?: string;

  @ApiPropertyOptional({ enum: TagTypeEnum, default: TagTypeEnum.GENERAL })
  @IsEnum(TagTypeEnum)
  @IsOptional()
  type?: TagTypeEnum = TagTypeEnum.GENERAL;
}

