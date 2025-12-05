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
import { ThemesService } from './themes.service';
import {
  CreateThemeDto,
  UpdateThemeDto,
  UpdateThemeSettingsDto,
  ActivateThemeDto,
  ThemeQueryDto,
} from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all themes' })
  @ApiResponse({ status: 200, description: 'List of themes' })
  async findAll(@Query() query: ThemeQueryDto) {
    return this.themesService.findAll(query);
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Get active theme' })
  @ApiResponse({ status: 200, description: 'Active theme details' })
  async getActive() {
    return this.themesService.getActiveTheme();
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get theme by slug' })
  @ApiResponse({ status: 200, description: 'Theme details' })
  async findOne(@Param('slug') slug: string) {
    return this.themesService.findBySlug(slug);
  }

  @Get(':slug/settings')
  @Public()
  @ApiOperation({ summary: 'Get theme settings' })
  @ApiResponse({ status: 200, description: 'Theme settings' })
  async getSettings(@Param('slug') slug: string) {
    return this.themesService.getSettings(slug);
  }

  @Get(':slug/templates')
  @Public()
  @ApiOperation({ summary: 'Get theme templates' })
  @ApiResponse({ status: 200, description: 'Theme templates' })
  async getTemplates(@Param('slug') slug: string) {
    return this.themesService.getTemplates(slug);
  }

  @Get(':slug/regions')
  @Public()
  @ApiOperation({ summary: 'Get theme regions' })
  @ApiResponse({ status: 200, description: 'Theme regions' })
  async getRegions(@Param('slug') slug: string) {
    return this.themesService.getRegions(slug);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Install a new theme' })
  @ApiResponse({ status: 201, description: 'Theme installed' })
  async install(@Body() dto: CreateThemeDto) {
    return this.themesService.install(dto);
  }

  @Post(':slug/activate')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a theme' })
  @ApiResponse({ status: 200, description: 'Theme activated' })
  async activate(@Param('slug') slug: string) {
    return this.themesService.activate(slug);
  }

  @Post(':slug/deactivate')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a theme' })
  @ApiResponse({ status: 200, description: 'Theme deactivated' })
  async deactivate(@Param('slug') slug: string) {
    return this.themesService.deactivate(slug);
  }

  @Put(':slug/settings')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update theme settings' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  async updateSettings(
    @Param('slug') slug: string,
    @Body() dto: UpdateThemeSettingsDto,
  ) {
    return this.themesService.updateSettings(slug, dto);
  }

  @Post(':slug/settings/reset')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset theme settings to defaults' })
  @ApiResponse({ status: 200, description: 'Settings reset' })
  async resetSettings(@Param('slug') slug: string) {
    return this.themesService.resetSettings(slug);
  }

  @Get(':slug/export')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Export theme settings' })
  @ApiResponse({ status: 200, description: 'Exported settings' })
  async exportSettings(@Param('slug') slug: string) {
    return this.themesService.exportSettings(slug);
  }

  @Post(':slug/import')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import theme settings' })
  @ApiResponse({ status: 200, description: 'Settings imported' })
  async importSettings(
    @Param('slug') slug: string,
    @Body() body: { settings: Record<string, any> },
  ) {
    return this.themesService.importSettings(slug, body.settings);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Uninstall a theme' })
  @ApiResponse({ status: 204, description: 'Theme uninstalled' })
  async uninstall(@Param('slug') slug: string) {
    return this.themesService.uninstall(slug);
  }
}
