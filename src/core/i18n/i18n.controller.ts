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
import { I18nService } from './i18n.service';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
  LanguageQueryDto,
  CreateNamespaceDto,
  UpdateNamespaceDto,
  CreateTranslationDto,
  UpdateTranslationDto,
  BulkCreateTranslationsDto,
  TranslationQueryDto,
  ImportTranslationsDto,
  ExportTranslationsDto,
} from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  // ============================================
  // LANGUAGES
  // ============================================

  @Get('languages')
  @Public()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'List of languages' })
  async getLanguages(@Query() query: LanguageQueryDto) {
    return this.i18nService.findAllLanguages(query);
  }

  @Get('languages/active')
  @Public()
  @ApiOperation({ summary: 'Get active languages' })
  @ApiResponse({ status: 200, description: 'List of active languages' })
  async getActiveLanguages() {
    return this.i18nService.getActiveLanguages();
  }

  @Get('languages/default')
  @Public()
  @ApiOperation({ summary: 'Get default language' })
  @ApiResponse({ status: 200, description: 'Default language' })
  async getDefaultLanguage() {
    return this.i18nService.getDefaultLanguage();
  }

  @Get('languages/:code')
  @Public()
  @ApiOperation({ summary: 'Get language by code' })
  @ApiResponse({ status: 200, description: 'Language details' })
  async getLanguage(@Param('code') code: string) {
    return this.i18nService.findLanguageByCode(code);
  }

  @Post('languages')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Add a new language' })
  @ApiResponse({ status: 201, description: 'Language created' })
  async createLanguage(@Body() dto: CreateLanguageDto) {
    return this.i18nService.createLanguage(dto);
  }

  @Put('languages/:code')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update a language' })
  @ApiResponse({ status: 200, description: 'Language updated' })
  async updateLanguage(
    @Param('code') code: string,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.i18nService.updateLanguage(code, dto);
  }

  @Delete('languages/:code')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a language' })
  @ApiResponse({ status: 204, description: 'Language deleted' })
  async deleteLanguage(@Param('code') code: string) {
    return this.i18nService.deleteLanguage(code);
  }

  @Get('languages/stats')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Get translation statistics by language' })
  @ApiResponse({ status: 200, description: 'Language statistics' })
  async getLanguageStats() {
    return this.i18nService.getLanguageStats();
  }

  // ============================================
  // NAMESPACES
  // ============================================

  @Get('namespaces')
  @Public()
  @ApiOperation({ summary: 'Get all namespaces' })
  @ApiResponse({ status: 200, description: 'List of namespaces' })
  async getNamespaces() {
    return this.i18nService.findAllNamespaces();
  }

  @Get('namespaces/:name')
  @Public()
  @ApiOperation({ summary: 'Get namespace by name' })
  @ApiResponse({ status: 200, description: 'Namespace details' })
  async getNamespace(@Param('name') name: string) {
    return this.i18nService.findNamespaceByName(name);
  }

  @Get('namespaces/:name/stats')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Get translation statistics for namespace' })
  @ApiResponse({ status: 200, description: 'Namespace statistics' })
  async getNamespaceStats(@Param('name') name: string) {
    return this.i18nService.getNamespaceStats(name);
  }

  @Post('namespaces')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a namespace' })
  @ApiResponse({ status: 201, description: 'Namespace created' })
  async createNamespace(@Body() dto: CreateNamespaceDto) {
    return this.i18nService.createNamespace(dto);
  }

  @Put('namespaces/:name')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Update a namespace' })
  @ApiResponse({ status: 200, description: 'Namespace updated' })
  async updateNamespace(
    @Param('name') name: string,
    @Body() dto: UpdateNamespaceDto,
  ) {
    return this.i18nService.updateNamespace(name, dto);
  }

  @Delete('namespaces/:name')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a namespace' })
  @ApiResponse({ status: 204, description: 'Namespace deleted' })
  async deleteNamespace(@Param('name') name: string) {
    return this.i18nService.deleteNamespace(name);
  }

  // ============================================
  // TRANSLATIONS
  // ============================================

  @Get('translations')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Get translations with filters' })
  @ApiResponse({ status: 200, description: 'List of translations' })
  async getTranslations(@Query() query: TranslationQueryDto) {
    return this.i18nService.findTranslations(query);
  }

  @Get('translations/:namespace/:language')
  @Public()
  @ApiOperation({ summary: 'Get translation bundle for namespace and language' })
  @ApiResponse({ status: 200, description: 'Translation bundle' })
  async getBundle(
    @Param('namespace') namespace: string,
    @Param('language') language: string,
  ) {
    return this.i18nService.getBundle(namespace, language);
  }

  @Get('translations/all/:language')
  @Public()
  @ApiOperation({ summary: 'Get all translation bundles for a language' })
  @ApiResponse({ status: 200, description: 'All translation bundles' })
  async getAllBundles(@Param('language') language: string) {
    return this.i18nService.getAllBundles(language);
  }

  @Post('translations')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a translation' })
  @ApiResponse({ status: 201, description: 'Translation created' })
  async createTranslation(@Body() dto: CreateTranslationDto) {
    return this.i18nService.createTranslation(dto);
  }

  @Post('translations/bulk')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Bulk create translations' })
  @ApiResponse({ status: 201, description: 'Translations created' })
  async bulkCreateTranslations(@Body() dto: BulkCreateTranslationsDto) {
    return this.i18nService.bulkCreateTranslations(dto);
  }

  @Put('translations/:namespace/:key/:language')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update a translation' })
  @ApiResponse({ status: 200, description: 'Translation updated' })
  async updateTranslation(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Param('language') language: string,
    @Body() dto: UpdateTranslationDto,
  ) {
    return this.i18nService.updateTranslation(namespace, key, language, dto);
  }

  @Delete('translations/:namespace/:key/:language')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a translation' })
  @ApiResponse({ status: 204, description: 'Translation deleted' })
  async deleteTranslation(
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Param('language') language: string,
  ) {
    return this.i18nService.deleteTranslation(namespace, key, language);
  }

  // ============================================
  // IMPORT/EXPORT
  // ============================================

  @Post('import')
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Import translations' })
  @ApiResponse({ status: 200, description: 'Import result' })
  async importTranslations(@Body() dto: ImportTranslationsDto) {
    return this.i18nService.importTranslations(dto);
  }

  @Post('export')
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export translations' })
  @ApiResponse({ status: 200, description: 'Exported translations' })
  async exportTranslations(@Body() dto: ExportTranslationsDto) {
    return this.i18nService.exportTranslations(dto);
  }

  // ============================================
  // CACHE
  // ============================================

  @Post('cache/clear')
  @ApiBearerAuth()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear translation cache' })
  @ApiResponse({ status: 200, description: 'Cache cleared' })
  async clearCache() {
    this.i18nService.clearCache();
    return { success: true };
  }
}
