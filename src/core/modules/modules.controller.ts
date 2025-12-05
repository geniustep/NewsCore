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
import { ModulesService } from './modules.service';
import {
  CreateModuleDto,
  UpdateModuleDto,
  UpdateModuleSettingsDto,
  ModuleQueryDto,
} from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'List of modules' })
  async findAll(@Query() query: ModuleQueryDto) {
    return this.modulesService.findAll(query);
  }

  @Get('loaded')
  @Public()
  @ApiOperation({ summary: 'Get all loaded (enabled) modules' })
  @ApiResponse({ status: 200, description: 'List of loaded modules' })
  async getLoaded() {
    return this.modulesService.getLoadedModules();
  }

  @Get('hooks')
  @Public()
  @ApiOperation({ summary: 'Get all registered hooks' })
  @ApiResponse({ status: 200, description: 'List of hooks' })
  async getHooks() {
    return this.modulesService.getRegisteredHooks();
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get module by slug' })
  @ApiResponse({ status: 200, description: 'Module details' })
  async findOne(@Param('slug') slug: string) {
    return this.modulesService.findBySlug(slug);
  }

  @Get(':slug/settings')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Get module settings' })
  @ApiResponse({ status: 200, description: 'Module settings' })
  async getSettings(@Param('slug') slug: string) {
    return this.modulesService.getSettings(slug);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Install a new module' })
  @ApiResponse({ status: 201, description: 'Module installed' })
  async install(@Body() dto: CreateModuleDto) {
    return this.modulesService.install(dto);
  }

  @Post(':slug/enable')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable a module' })
  @ApiResponse({ status: 200, description: 'Module enabled' })
  async enable(@Param('slug') slug: string) {
    return this.modulesService.enable(slug);
  }

  @Post(':slug/disable')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable a module' })
  @ApiResponse({ status: 200, description: 'Module disabled' })
  async disable(@Param('slug') slug: string) {
    return this.modulesService.disable(slug);
  }

  @Put(':slug/settings')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update module settings' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  async updateSettings(
    @Param('slug') slug: string,
    @Body() dto: UpdateModuleSettingsDto,
  ) {
    return this.modulesService.updateSettings(slug, dto);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Uninstall a module' })
  @ApiResponse({ status: 204, description: 'Module uninstalled' })
  async uninstall(@Param('slug') slug: string) {
    return this.modulesService.uninstall(slug);
  }
}
