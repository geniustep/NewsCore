import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkflowStatusDto {
  @ApiProperty({ description: 'حالة المقال الجديدة' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: 'تعليق على تغيير الحالة' })
  @IsOptional()
  @IsString()
  comment?: string;
}
