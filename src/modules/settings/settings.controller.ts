import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateSettingDto, UpdateSettingDto, ThemeSettingsDto } from './dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Public endpoints (no authentication required)
  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get all public settings' })
  async getPublicSettings() {
    return this.settingsService.findAll(true);
  }

  @Public()
  @Get('public/theme')
  @ApiOperation({ summary: 'Get public theme settings' })
  async getPublicThemeSettings() {
    return this.settingsService.getThemeSettings();
  }

  @Public()
  @Get('public/site')
  @ApiOperation({ summary: 'Get public site settings' })
  async getPublicSiteSettings() {
    return this.settingsService.getSiteSettings();
  }

  @Public()
  @Get('public/:key')
  @ApiOperation({ summary: 'Get a public setting by key' })
  async getPublicSetting(@Param('key') key: string) {
    return this.settingsService.findPublicByKey(key);
  }

  // Admin endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings (admin)' })
  async getAllSettings(@Query('public') isPublic?: string) {
    const publicFilter = isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;
    return this.settingsService.findAll(publicFilter);
  }

  @Get('group/:group')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get settings by group' })
  async getSettingsByGroup(@Param('group') group: string) {
    return this.settingsService.findByGroup(group);
  }

  @Get('theme')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get theme settings' })
  async getThemeSettings() {
    return this.settingsService.getThemeSettings();
  }

  @Put('theme')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update theme settings' })
  async updateThemeSettings(@Body() dto: ThemeSettingsDto) {
    return this.settingsService.updateThemeSettings(dto);
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a setting by key' })
  async getSetting(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new setting' })
  async createSetting(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a setting' })
  async updateSetting(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(key, dto);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a setting' })
  async deleteSetting(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
}

