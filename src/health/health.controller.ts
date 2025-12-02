import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
