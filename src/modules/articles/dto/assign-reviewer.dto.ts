import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignReviewerDto {
  @ApiProperty({ description: 'معرف المراجع' })
  @IsUUID()
  reviewerId: string;
}
