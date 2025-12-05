import { IsString, IsOptional, IsUrl, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBreakingNewsDto {
  @ApiProperty({ description: 'عنوان الخبر العاجل' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'رابط الخبر' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ description: 'أولوية العرض (كلما زاد الرقم زادت الأولوية)', default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ description: 'حالة النشاط', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'تاريخ انتهاء الصلاحية' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
