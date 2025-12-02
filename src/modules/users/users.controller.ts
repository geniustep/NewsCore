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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('المستخدمين')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles('admin', 'super_admin', 'editor')
  @ApiOperation({ summary: 'الحصول على قائمة المستخدمين' })
  @ApiResponse({ status: 200, description: 'قائمة المستخدمين' })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'super_admin', 'editor')
  @ApiOperation({ summary: 'الحصول على مستخدم محدد' })
  @ApiResponse({ status: 200, description: 'بيانات المستخدم' })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'تحديث مستخدم' })
  @ApiResponse({ status: 200, description: 'تم تحديث المستخدم بنجاح' })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'حذف مستخدم' })
  @ApiResponse({ status: 200, description: 'تم حذف المستخدم بنجاح' })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}

