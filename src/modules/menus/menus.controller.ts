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
import { MenusService } from './menus.service';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuQueryDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('القوائم')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // ============================================
  // MENU CRUD
  // ============================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء قائمة جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء القائمة بنجاح' })
  create(
    @Body() dto: CreateMenuDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.menusService.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على قائمة القوائم' })
  @ApiResponse({ status: 200, description: 'قائمة القوائم' })
  findAll(@Query() query: MenuQueryDto) {
    return this.menusService.findAll(query);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'الحصول على القوائم النشطة (عام)' })
  @ApiResponse({ status: 200, description: 'قائمة القوائم النشطة' })
  findPublic(@Query() query: MenuQueryDto) {
    query.isActive = true;
    return this.menusService.findAll(query);
  }

  @Get('location/:location')
  @Public()
  @ApiOperation({ summary: 'الحصول على قائمة حسب الموقع' })
  @ApiResponse({ status: 200, description: 'بيانات القائمة' })
  findByLocation(
    @Param('location') location: string,
    @Query() query: MenuQueryDto,
  ) {
    return this.menusService.findByLocation(location, query);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'الحصول على قائمة بواسطة الرابط' })
  @ApiResponse({ status: 200, description: 'بيانات القائمة' })
  @ApiResponse({ status: 404, description: 'القائمة غير موجودة' })
  findBySlug(@Param('slug') slug: string, @Query() query: MenuQueryDto) {
    return this.menusService.findBySlug(slug, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على قائمة محددة' })
  @ApiResponse({ status: 200, description: 'بيانات القائمة' })
  @ApiResponse({ status: 404, description: 'القائمة غير موجودة' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث قائمة' })
  @ApiResponse({ status: 200, description: 'تم تحديث القائمة بنجاح' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.menusService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف قائمة' })
  @ApiResponse({ status: 200, description: 'تم حذف القائمة بنجاح' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.remove(id);
  }

  // ============================================
  // MENU ITEMS
  // ============================================

  @Post(':menuId/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة عنصر إلى قائمة' })
  @ApiResponse({ status: 201, description: 'تم إضافة العنصر بنجاح' })
  createItem(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menusService.createItem(menuId, dto);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث عنصر قائمة' })
  @ApiResponse({ status: 200, description: 'تم تحديث العنصر بنجاح' })
  updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menusService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف عنصر قائمة' })
  @ApiResponse({ status: 200, description: 'تم حذف العنصر بنجاح' })
  removeItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.removeItem(id);
  }

  @Post(':menuId/items/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إعادة ترتيب عناصر القائمة' })
  @ApiResponse({ status: 200, description: 'تم إعادة الترتيب بنجاح' })
  reorderItems(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() itemOrders: { id: string; sortOrder: number; parentId?: string | null }[],
  ) {
    return this.menusService.reorderItems(menuId, itemOrders);
  }

  // ============================================
  // MENU LOCATIONS
  // ============================================

  @Post(':menuId/locations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تعيين موقع للقائمة' })
  @ApiResponse({ status: 201, description: 'تم تعيين الموقع بنجاح' })
  assignLocation(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() body: { location: string; priority?: number; conditions?: any },
  ) {
    return this.menusService.assignLocation(
      menuId,
      body.location,
      body.priority,
      body.conditions,
    );
  }

  @Delete(':menuId/locations/:location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إزالة موقع من القائمة' })
  @ApiResponse({ status: 200, description: 'تم إزالة الموقع بنجاح' })
  removeLocation(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Param('location') location: string,
  ) {
    return this.menusService.removeLocation(menuId, location);
  }

  // ============================================
  // DYNAMIC ITEMS
  // ============================================

  @Get('dynamic/:type')
  @Public()
  @ApiOperation({ summary: 'الحصول على عناصر ديناميكية' })
  @ApiResponse({ status: 200, description: 'قائمة العناصر الديناميكية' })
  getDynamicItems(
    @Param('type') type: string,
    @Query('limit') limit?: number,
  ) {
    return this.menusService.getDynamicItems(type, limit ? parseInt(limit.toString()) : 5);
  }
}

