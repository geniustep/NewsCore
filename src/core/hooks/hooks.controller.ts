import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HooksService } from './hooks.service';
import { CreateHookDto, RegisterListenerDto, UpdateListenerDto } from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Hooks')
@Controller('hooks')
export class HooksController {
  constructor(private readonly hooksService: HooksService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all hooks' })
  @ApiResponse({ status: 200, description: 'List of hooks' })
  async findAll() {
    return this.hooksService.findAllHooks();
  }

  @Get('system')
  @Public()
  @ApiOperation({ summary: 'Get available system hooks' })
  @ApiResponse({ status: 200, description: 'List of system hooks' })
  async getSystemHooks() {
    return this.hooksService.getSystemHooks();
  }

  @Get('registered')
  @Public()
  @ApiOperation({ summary: 'Get registered hook names' })
  @ApiResponse({ status: 200, description: 'List of registered hooks' })
  async getRegisteredHooks() {
    return this.hooksService.getRegisteredHooks();
  }

  @Get(':name')
  @Public()
  @ApiOperation({ summary: 'Get hook by name' })
  @ApiResponse({ status: 200, description: 'Hook details' })
  async findOne(@Param('name') name: string) {
    return this.hooksService.findHookByName(name);
  }

  @Get(':name/handlers')
  @Public()
  @ApiOperation({ summary: 'Get handlers for a hook' })
  @ApiResponse({ status: 200, description: 'List of handlers' })
  async getHandlers(@Param('name') name: string) {
    return this.hooksService.getHandlers(name).map(h => ({
      moduleSlug: h.moduleSlug,
      priority: h.priority,
    }));
  }

  @Post()
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a hook' })
  @ApiResponse({ status: 201, description: 'Hook created' })
  async create(@Body() dto: CreateHookDto) {
    return this.hooksService.createHook(dto);
  }

  @Post('listeners')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Register a listener' })
  @ApiResponse({ status: 201, description: 'Listener registered' })
  async registerListener(@Body() dto: RegisterListenerDto) {
    return this.hooksService.registerListener(dto);
  }

  @Put('listeners/:id')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update a listener' })
  @ApiResponse({ status: 200, description: 'Listener updated' })
  async updateListener(
    @Param('id') id: string,
    @Body() dto: UpdateListenerDto,
  ) {
    return this.hooksService.updateListener(id, dto);
  }

  @Delete(':name')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hook' })
  @ApiResponse({ status: 204, description: 'Hook deleted' })
  async delete(@Param('name') name: string) {
    return this.hooksService.deleteHook(name);
  }

  @Delete(':name/listeners/:moduleSlug')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a listener' })
  @ApiResponse({ status: 204, description: 'Listener removed' })
  async removeListener(
    @Param('name') name: string,
    @Param('moduleSlug') moduleSlug: string,
  ) {
    return this.hooksService.removeListener(name, moduleSlug);
  }
}
