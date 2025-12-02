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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('التصنيفات')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء تصنيف جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء التصنيف بنجاح' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'الحصول على قائمة التصنيفات' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'قائمة التصنيفات' })
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.categoriesService.findAll(includeInactive === 'true');
  }

  @Get('tree')
  @Public()
  @ApiOperation({ summary: 'الحصول على شجرة التصنيفات' })
  @ApiResponse({ status: 200, description: 'شجرة التصنيفات' })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'الحصول على تصنيف بواسطة الرابط' })
  @ApiResponse({ status: 200, description: 'بيانات التصنيف' })
  @ApiResponse({ status: 404, description: 'التصنيف غير موجود' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'الحصول على تصنيف محدد' })
  @ApiResponse({ status: 200, description: 'بيانات التصنيف' })
  @ApiResponse({ status: 404, description: 'التصنيف غير موجود' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث تصنيف' })
  @ApiResponse({ status: 200, description: 'تم تحديث التصنيف بنجاح' })
  @ApiResponse({ status: 404, description: 'التصنيف غير موجود' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف تصنيف' })
  @ApiResponse({ status: 200, description: 'تم حذف التصنيف بنجاح' })
  @ApiResponse({ status: 404, description: 'التصنيف غير موجود' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}

