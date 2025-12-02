import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  getRoot(): { message: string; version: string; api: string; endpoints: string[] } {
    return {
      message: 'NewsCore API - Modern News CMS Backend',
      version: '0.1.0',
      api: '/api/v1',
      endpoints: [
        '/api/v1/health',
        '/api/v1/auth/login',
        '/api/v1/articles',
        '/api/v1/categories',
        '/api/v1/tags',
      ],
    };
  }
}
