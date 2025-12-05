import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto, UpdateWidgetDto, WidgetQueryDto, ReorderWidgetsDto } from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Widgets')
@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all widgets' })
  @ApiResponse({ status: 200, description: 'List of widgets' })
  async findAll(@Query() query: WidgetQueryDto) {
    return this.widgetsService.findAll(query);
  }

  @Get('types')
  @Public()
  @ApiOperation({ summary: 'Get available widget types' })
  @ApiResponse({ status: 200, description: 'List of widget types' })
  async getTypes() {
    return this.widgetsService.getWidgetTypes();
  }

  @Get('regions')
  @Public()
  @ApiOperation({ summary: 'Get available regions' })
  @ApiResponse({ status: 200, description: 'List of regions' })
  async getRegions() {
    return this.widgetsService.getRegions();
  }

  @Get('region/:region')
  @Public()
  @ApiOperation({ summary: 'Get widgets by region' })
  @ApiResponse({ status: 200, description: 'List of widgets in region' })
  async findByRegion(
    @Param('region') region: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.widgetsService.findByRegion(region, { isActive });
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get widget by slug' })
  @ApiResponse({ status: 200, description: 'Widget details' })
  async findOne(@Param('slug') slug: string) {
    return this.widgetsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a widget' })
  @ApiResponse({ status: 201, description: 'Widget created' })
  async create(@Body() dto: CreateWidgetDto) {
    return this.widgetsService.create(dto);
  }

  @Put(':slug')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update a widget' })
  @ApiResponse({ status: 200, description: 'Widget updated' })
  async update(@Param('slug') slug: string, @Body() dto: UpdateWidgetDto) {
    return this.widgetsService.update(slug, dto);
  }

  @Post(':slug/toggle')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle widget active status' })
  @ApiResponse({ status: 200, description: 'Widget toggled' })
  async toggle(@Param('slug') slug: string) {
    return this.widgetsService.toggle(slug);
  }

  @Post(':slug/duplicate')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Duplicate a widget' })
  @ApiResponse({ status: 201, description: 'Widget duplicated' })
  async duplicate(
    @Param('slug') slug: string,
    @Body('newSlug') newSlug: string,
  ) {
    return this.widgetsService.duplicate(slug, newSlug);
  }

  @Post('reorder')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder widgets in a region' })
  @ApiResponse({ status: 200, description: 'Widgets reordered' })
  async reorder(@Body() dto: ReorderWidgetsDto) {
    return this.widgetsService.reorder(dto);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a widget' })
  @ApiResponse({ status: 204, description: 'Widget deleted' })
  async delete(@Param('slug') slug: string) {
    return this.widgetsService.delete(slug);
  }
}
