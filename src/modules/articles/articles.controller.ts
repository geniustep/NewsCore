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
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('المقالات')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء مقال جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المقال بنجاح' })
  create(
    @Body() dto: CreateArticleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على قائمة المقالات' })
  @ApiResponse({ status: 200, description: 'قائمة المقالات' })
  findAll(@Query() query: ArticleQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'الحصول على المقالات المنشورة (عام)' })
  @ApiResponse({ status: 200, description: 'قائمة المقالات المنشورة' })
  findPublished(@Query() query: ArticleQueryDto) {
    query.status = 'PUBLISHED' as any;
    return this.articlesService.findAll(query);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'الحصول على مقال بواسطة الرابط' })
  @ApiResponse({ status: 200, description: 'بيانات المقال' })
  @ApiResponse({ status: 404, description: 'المقال غير موجود' })
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على مقال محدد' })
  @ApiResponse({ status: 200, description: 'بيانات المقال' })
  @ApiResponse({ status: 404, description: 'المقال غير موجود' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث مقال' })
  @ApiResponse({ status: 200, description: 'تم تحديث المقال بنجاح' })
  @ApiResponse({ status: 404, description: 'المقال غير موجود' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.articlesService.update(id, dto, userId, roles);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'نشر مقال' })
  @ApiResponse({ status: 200, description: 'تم نشر المقال بنجاح' })
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.publish(id, userId);
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'أرشفة مقال' })
  @ApiResponse({ status: 200, description: 'تم أرشفة المقال بنجاح' })
  archive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.archive(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف مقال' })
  @ApiResponse({ status: 200, description: 'تم حذف المقال بنجاح' })
  @ApiResponse({ status: 404, description: 'المقال غير موجود' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.articlesService.remove(id, userId, roles);
  }
}

