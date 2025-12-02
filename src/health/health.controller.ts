import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'health', version: 'v1' })
export class HealthController {
  @Get()
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
