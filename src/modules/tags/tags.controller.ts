import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('الوسوم')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء وسم جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الوسم بنجاح' })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'الحصول على قائمة الوسوم' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiResponse({ status: 200, description: 'قائمة الوسوم' })
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.tagsService.findAll(search, type);
  }

  @Get('popular')
  @Public()
  @ApiOperation({ summary: 'الحصول على الوسوم الأكثر استخداماً' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'الوسوم الشائعة' })
  findPopular(@Query('limit') limit?: string) {
    return this.tagsService.findPopular(limit ? parseInt(limit) : 20);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'الحصول على وسم بواسطة الرابط' })
  @ApiResponse({ status: 200, description: 'بيانات الوسم' })
  @ApiResponse({ status: 404, description: 'الوسم غير موجود' })
  findBySlug(@Param('slug') slug: string) {
    return this.tagsService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'الحصول على وسم محدد' })
  @ApiResponse({ status: 200, description: 'بيانات الوسم' })
  @ApiResponse({ status: 404, description: 'الوسم غير موجود' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث وسم' })
  @ApiResponse({ status: 200, description: 'تم تحديث الوسم بنجاح' })
  @ApiResponse({ status: 404, description: 'الوسم غير موجود' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف وسم' })
  @ApiResponse({ status: 200, description: 'تم حذف الوسم بنجاح' })
  @ApiResponse({ status: 404, description: 'الوسم غير موجود' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}

