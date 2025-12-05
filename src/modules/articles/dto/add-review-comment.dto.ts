import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddReviewCommentDto {
  @ApiProperty({ description: 'نص التعليق' })
  @IsString()
  comment: string;
}
