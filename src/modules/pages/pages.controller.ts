import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import {
  CreatePageDto,
  UpdatePageDto,
  PageQueryDto,
  CreatePageTranslationDto,
  UpdatePageTranslationDto,
} from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @Roles('admin', 'super_admin', 'editor')
  create(@Body() dto: CreatePageDto, @CurrentUser('id') userId: string) {
    return this.pagesService.create(dto, userId);
  }

  @Get()
  @Public()
  findAll(@Query() query: PageQueryDto) {
    return this.pagesService.findAll(query);
  }

  @Get('tree')
  @Public()
  getTree(@Query('language') language?: string) {
    return this.pagesService.getTree(language);
  }

  @Get('homepage')
  @Public()
  findHomepage(@Query('language') language?: string) {
    return this.pagesService.findHomepage(language);
  }

  @Get('slug/:slug')
  @Public()
  findBySlug(@Param('slug') slug: string, @Query('language') language?: string) {
    return this.pagesService.findBySlug(slug, language);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'super_admin', 'editor')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') userRoles: string[],
  ) {
    return this.pagesService.update(id, dto, userId, userRoles);
  }

  @Post(':id/publish')
  @Roles('admin', 'super_admin', 'editor')
  publish(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.pagesService.publish(id, userId);
  }

  @Post(':id/archive')
  @Roles('admin', 'super_admin', 'editor')
  archive(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.pagesService.archive(id, userId);
  }

  @Post(':id/set-homepage')
  @Roles('admin', 'super_admin')
  setAsHomepage(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.pagesService.setAsHomepage(id, userId);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin', 'editor')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') userRoles: string[],
  ) {
    return this.pagesService.remove(id, userId, userRoles);
  }

  @Post('reorder')
  @Roles('admin', 'super_admin', 'editor')
  reorder(@Body() items: { id: string; sortOrder: number; parentId?: string | null }[]) {
    return this.pagesService.reorder(items);
  }

  // Translation endpoints
  @Get(':id/translations')
  @Public()
  getTranslations(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.getTranslations(id);
  }

  @Post(':id/translations')
  @Roles('admin', 'super_admin', 'editor', 'translator')
  createTranslation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePageTranslationDto,
  ) {
    return this.pagesService.createTranslation(id, dto);
  }

  @Patch('translations/:translationId')
  @Roles('admin', 'super_admin', 'editor', 'translator')
  updateTranslation(
    @Param('translationId', ParseUUIDPipe) translationId: string,
    @Body() dto: UpdatePageTranslationDto,
  ) {
    return this.pagesService.updateTranslation(translationId, dto);
  }

  @Delete('translations/:translationId')
  @Roles('admin', 'super_admin', 'editor')
  deleteTranslation(@Param('translationId', ParseUUIDPipe) translationId: string) {
    return this.pagesService.deleteTranslation(translationId);
  }
}

