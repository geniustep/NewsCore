import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('التحليلات')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin', 'editor')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'نظرة عامة على التحليلات' })
  @ApiResponse({ status: 200, description: 'نظرة عامة على التحليلات' })
  getOverview(@Query('period') period?: string) {
    return this.analyticsService.getOverview({ period });
  }

  @Get('pageviews')
  @ApiOperation({ summary: 'إحصائيات المشاهدات' })
  @ApiResponse({ status: 200, description: 'إحصائيات المشاهدات' })
  getPageviews(@Query('period') period?: string) {
    return this.analyticsService.getPageviews({ period });
  }

  @Get('top-articles')
  @ApiOperation({ summary: 'المقالات الأكثر مشاهدة' })
  @ApiResponse({ status: 200, description: 'المقالات الأكثر مشاهدة' })
  getTopArticles(
    @Query('limit') limit?: string,
    @Query('period') period?: string,
  ) {
    return this.analyticsService.getTopArticles({
      limit: limit ? parseInt(limit, 10) : undefined,
      period,
    });
  }

  @Get('traffic-sources')
  @ApiOperation({ summary: 'مصادر الزيارات' })
  @ApiResponse({ status: 200, description: 'مصادر الزيارات' })
  getTrafficSources(@Query('period') period?: string) {
    return this.analyticsService.getTrafficSources({ period });
  }

  @Get('realtime')
  @ApiOperation({ summary: 'الزوار المباشرون' })
  @ApiResponse({ status: 200, description: 'الزوار المباشرون' })
  getRealtimeVisitors() {
    return this.analyticsService.getRealtimeVisitors();
  }
}
