import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

