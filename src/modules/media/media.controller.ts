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
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('الوسائط')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @Roles('admin', 'super_admin', 'editor', 'author')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'رفع ملف' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        alt: { type: 'string' },
        caption: { type: 'string' },
        credit: { type: 'string' },
        folderId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'تم رفع الملف بنجاح' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMediaDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.mediaService.upload(file, dto, userId);
  }

  @Get()
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiOperation({ summary: 'الحصول على قائمة الوسائط' })
  @ApiQuery({ name: 'type', required: false, enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'] })
  @ApiQuery({ name: 'folderId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'قائمة الوسائط' })
  findAll(
    @Query('type') type?: string,
    @Query('folderId') folderId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.mediaService.findAll({
      type,
      folderId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('folders')
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiOperation({ summary: 'الحصول على قائمة المجلدات' })
  @ApiQuery({ name: 'parentId', required: false })
  @ApiResponse({ status: 200, description: 'قائمة المجلدات' })
  getFolders(@Query('parentId') parentId?: string) {
    return this.mediaService.getFolders(parentId);
  }

  @Post('folders')
  @Roles('admin', 'super_admin', 'editor')
  @ApiOperation({ summary: 'إنشاء مجلد جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المجلد بنجاح' })
  createFolder(
    @Body('name') name: string,
    @Body('parentId') parentId?: string,
  ) {
    return this.mediaService.createFolder(name, parentId);
  }

  @Delete('folders/:id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'حذف مجلد' })
  @ApiResponse({ status: 200, description: 'تم حذف المجلد بنجاح' })
  deleteFolder(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.deleteFolder(id);
  }

  @Get(':id')
  @Roles('admin', 'super_admin', 'editor', 'author')
  @ApiOperation({ summary: 'الحصول على ملف محدد' })
  @ApiResponse({ status: 200, description: 'بيانات الملف' })
  @ApiResponse({ status: 404, description: 'الملف غير موجود' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'super_admin', 'editor')
  @ApiOperation({ summary: 'تحديث بيانات ملف' })
  @ApiResponse({ status: 200, description: 'تم تحديث الملف بنجاح' })
  @ApiResponse({ status: 404, description: 'الملف غير موجود' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMediaDto,
  ) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin', 'editor')
  @ApiOperation({ summary: 'حذف ملف' })
  @ApiResponse({ status: 200, description: 'تم حذف الملف بنجاح' })
  @ApiResponse({ status: 404, description: 'الملف غير موجود' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }
}

