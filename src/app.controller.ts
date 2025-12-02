import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  @Get()
  getRoot(): { message: string; version: string; api: string; endpoints: string[] } {
    return {
      message: 'NewsCore API - Modern News CMS Backend',
      version: '0.1.0',
      api: '/api',
      endpoints: [
        '/api/health',
      ],
    };
  }
}

