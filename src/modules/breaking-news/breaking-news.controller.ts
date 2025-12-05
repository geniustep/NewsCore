import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto, UpdateBreakingNewsDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('الأخبار العاجلة')
@Controller('breaking-news')
export class BreakingNewsController {
  constructor(private readonly breakingNewsService: BreakingNewsService) {}

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'الحصول على الأخبار العاجلة النشطة' })
  @ApiResponse({ status: 200, description: 'قائمة الأخبار العاجلة النشطة' })
  getActive() {
    return this.breakingNewsService.getActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على جميع الأخبار العاجلة' })
  @ApiResponse({ status: 200, description: 'قائمة جميع الأخبار العاجلة' })
  findAll() {
    return this.breakingNewsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء خبر عاجل جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الخبر العاجل بنجاح' })
  create(
    @Body() dto: CreateBreakingNewsDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.breakingNewsService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث خبر عاجل' })
  @ApiResponse({ status: 200, description: 'تم تحديث الخبر العاجل بنجاح' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBreakingNewsDto,
  ) {
    return this.breakingNewsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف خبر عاجل' })
  @ApiResponse({ status: 200, description: 'تم حذف الخبر العاجل بنجاح' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.breakingNewsService.delete(id);
  }

  @Post(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تبديل حالة الخبر العاجل' })
  @ApiResponse({ status: 200, description: 'تم تبديل الحالة بنجاح' })
  toggle(@Param('id', ParseUUIDPipe) id: string) {
    return this.breakingNewsService.toggle(id);
  }
}
