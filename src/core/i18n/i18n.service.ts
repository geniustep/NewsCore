import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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
import {
  TranslationBundle,
  TranslationImportResult,
  TranslationStats,
  LanguageStats,
} from './interfaces/i18n.interface';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private translationsCache: Map<string, TranslationBundle> = new Map();

  constructor(private prisma: PrismaService) {}

  // ============================================
  // LANGUAGES
  // ============================================

  async findAllLanguages(query?: LanguageQueryDto) {
    const where: any = {};
    
    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return this.prisma.language.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { sortOrder: 'asc' },
        { code: 'asc' },
      ],
    });
  }

  async findLanguageByCode(code: string) {
    const language = await this.prisma.language.findUnique({
      where: { code },
    });

    if (!language) {
      throw new NotFoundException(`Language with code "${code}" not found`);
    }

    return language;
  }

  async getDefaultLanguage() {
    return this.prisma.language.findFirst({
      where: { isDefault: true },
    });
  }

  async getActiveLanguages() {
    return this.prisma.language.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createLanguage(dto: CreateLanguageDto) {
    // Check if code already exists
    const existing = await this.prisma.language.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Language with code "${dto.code}" already exists`);
    }

    // If this is the default, unset others
    if (dto.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.create({
      data: dto,
    });
  }

  async updateLanguage(code: string, dto: UpdateLanguageDto) {
    const language = await this.findLanguageByCode(code);

    // If setting as default, unset others
    if (dto.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true, code: { not: code } },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.update({
      where: { code },
      data: dto,
    });
  }

  async deleteLanguage(code: string) {
    const language = await this.findLanguageByCode(code);

    if (language.isDefault) {
      throw new BadRequestException('Cannot delete default language');
    }

    // Delete all translations for this language
    await this.prisma.translationKey.deleteMany({
      where: { language: { code } },
    });

    await this.prisma.language.delete({
      where: { code },
    });

    this.clearCache();
    return { success: true };
  }

  // ============================================
  // NAMESPACES
  // ============================================

  async findAllNamespaces() {
    return this.prisma.translationNamespace.findMany({
      orderBy: [
        { isSystem: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  async findNamespaceByName(name: string) {
    const namespace = await this.prisma.translationNamespace.findUnique({
      where: { name },
    });

    if (!namespace) {
      throw new NotFoundException(`Namespace "${name}" not found`);
    }

    return namespace;
  }

  async createNamespace(dto: CreateNamespaceDto) {
    const existing = await this.prisma.translationNamespace.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Namespace "${dto.name}" already exists`);
    }

    return this.prisma.translationNamespace.create({
      data: dto,
    });
  }

  async updateNamespace(name: string, dto: UpdateNamespaceDto) {
    await this.findNamespaceByName(name);

    return this.prisma.translationNamespace.update({
      where: { name },
      data: dto,
    });
  }

  async deleteNamespace(name: string) {
    const namespace = await this.findNamespaceByName(name);

    if (namespace.isSystem) {
      throw new BadRequestException('Cannot delete system namespace');
    }

    // Delete all keys in this namespace
    await this.prisma.translationKey.deleteMany({
      where: { namespaceId: namespace.id },
    });

    await this.prisma.translationNamespace.delete({
      where: { name },
    });

    this.clearCache();
    return { success: true };
  }

  // ============================================
  // TRANSLATIONS
  // ============================================

  async findTranslations(query?: TranslationQueryDto) {
    const where: any = {};

    if (query?.namespace) {
      where.namespace = { name: query.namespace };
    }
    if (query?.languageCode) {
      where.language = { code: query.languageCode };
    }
    if (query?.isReviewed !== undefined) {
      where.isReviewed = query.isReviewed;
    }
    if (query?.isAuto !== undefined) {
      where.isAuto = query.isAuto;
    }
    if (query?.search) {
      where.OR = [
        { key: { contains: query.search, mode: 'insensitive' } },
        { value: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.translationKey.findMany({
      where,
      include: {
        namespace: true,
        language: true,
      },
      orderBy: [
        { namespace: { name: 'asc' } },
        { key: 'asc' },
      ],
    });
  }

  async getTranslation(namespace: string, key: string, languageCode: string) {
    const translation = await this.prisma.translationKey.findFirst({
      where: {
        namespace: { name: namespace },
        language: { code: languageCode },
        key,
      },
    });

    return translation?.value || null;
  }

  async createTranslation(dto: CreateTranslationDto) {
    // Get namespace and language
    const [namespace, language] = await Promise.all([
      this.findNamespaceByName(dto.namespace),
      this.findLanguageByCode(dto.languageCode),
    ]);

    // Check if translation already exists
    const existing = await this.prisma.translationKey.findFirst({
      where: {
        namespaceId: namespace.id,
        languageId: language.id,
        key: dto.key,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Translation for key "${dto.key}" already exists in namespace "${dto.namespace}" for language "${dto.languageCode}"`
      );
    }

    const translation = await this.prisma.translationKey.create({
      data: {
        namespaceId: namespace.id,
        languageId: language.id,
        key: dto.key,
        value: dto.value,
        context: dto.context,
        pluralForms: dto.pluralForms,
        isAuto: dto.isAuto || false,
      },
      include: {
        namespace: true,
        language: true,
      },
    });

    this.invalidateCache(dto.namespace, dto.languageCode);
    return translation;
  }

  async updateTranslation(
    namespace: string,
    key: string,
    languageCode: string,
    dto: UpdateTranslationDto,
  ) {
    const [ns, lang] = await Promise.all([
      this.findNamespaceByName(namespace),
      this.findLanguageByCode(languageCode),
    ]);

    const existing = await this.prisma.translationKey.findFirst({
      where: {
        namespaceId: ns.id,
        languageId: lang.id,
        key,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Translation for key "${key}" not found in namespace "${namespace}" for language "${languageCode}"`
      );
    }

    const translation = await this.prisma.translationKey.update({
      where: { id: existing.id },
      data: {
        value: dto.value,
        context: dto.context,
        pluralForms: dto.pluralForms,
        isReviewed: dto.isReviewed,
        reviewedAt: dto.isReviewed ? new Date() : undefined,
      },
      include: {
        namespace: true,
        language: true,
      },
    });

    this.invalidateCache(namespace, languageCode);
    return translation;
  }

  async deleteTranslation(namespace: string, key: string, languageCode: string) {
    const [ns, lang] = await Promise.all([
      this.findNamespaceByName(namespace),
      this.findLanguageByCode(languageCode),
    ]);

    const existing = await this.prisma.translationKey.findFirst({
      where: {
        namespaceId: ns.id,
        languageId: lang.id,
        key,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Translation not found`);
    }

    await this.prisma.translationKey.delete({
      where: { id: existing.id },
    });

    this.invalidateCache(namespace, languageCode);
    return { success: true };
  }

  async bulkCreateTranslations(dto: BulkCreateTranslationsDto) {
    const [namespace, language] = await Promise.all([
      this.findNamespaceByName(dto.namespace),
      this.findLanguageByCode(dto.languageCode),
    ]);

    const operations = Object.entries(dto.translations).map(([key, value]) => {
      return this.prisma.translationKey.upsert({
        where: {
          namespaceId_key_languageId: {
            namespaceId: namespace.id,
            key,
            languageId: language.id,
          },
        },
        update: { value },
        create: {
          namespaceId: namespace.id,
          languageId: language.id,
          key,
          value,
        },
      });
    });

    await this.prisma.$transaction(operations);
    this.invalidateCache(dto.namespace, dto.languageCode);

    return { success: true, count: Object.keys(dto.translations).length };
  }

  // ============================================
  // BUNDLES & CACHE
  // ============================================

  async getBundle(namespace: string, languageCode: string): Promise<TranslationBundle> {
    const cacheKey = `${namespace}:${languageCode}`;
    
    if (this.translationsCache.has(cacheKey)) {
      return this.translationsCache.get(cacheKey)!;
    }

    const [ns, lang] = await Promise.all([
      this.findNamespaceByName(namespace),
      this.findLanguageByCode(languageCode),
    ]);

    const translations = await this.prisma.translationKey.findMany({
      where: {
        namespaceId: ns.id,
        languageId: lang.id,
      },
    });

    const bundle: TranslationBundle = {
      language: languageCode,
      namespace,
      translations: {},
    };

    for (const t of translations) {
      if (t.pluralForms) {
        bundle.translations[t.key] = t.pluralForms as any;
      } else {
        bundle.translations[t.key] = t.value;
      }
    }

    this.translationsCache.set(cacheKey, bundle);
    return bundle;
  }

  async getAllBundles(languageCode: string): Promise<Record<string, TranslationBundle>> {
    const namespaces = await this.findAllNamespaces();
    const bundles: Record<string, TranslationBundle> = {};

    for (const ns of namespaces) {
      try {
        bundles[ns.name] = await this.getBundle(ns.name, languageCode);
      } catch (error) {
        // Namespace might not have translations for this language
      }
    }

    return bundles;
  }

  invalidateCache(namespace?: string, languageCode?: string) {
    if (namespace && languageCode) {
      this.translationsCache.delete(`${namespace}:${languageCode}`);
    } else {
      this.translationsCache.clear();
    }
  }

  clearCache() {
    this.translationsCache.clear();
  }

  // ============================================
  // IMPORT/EXPORT
  // ============================================

  async importTranslations(dto: ImportTranslationsDto): Promise<TranslationImportResult> {
    const result: TranslationImportResult = {
      success: true,
      imported: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const [namespace, language] = await Promise.all([
        this.findNamespaceByName(dto.namespace),
        this.findLanguageByCode(dto.languageCode),
      ]);

      for (const [key, value] of Object.entries(dto.data)) {
        try {
          if (dto.overwrite) {
            await this.prisma.translationKey.upsert({
              where: {
                namespaceId_key_languageId: {
                  namespaceId: namespace.id,
                  key,
                  languageId: language.id,
                },
              },
              update: { value },
              create: {
                namespaceId: namespace.id,
                languageId: language.id,
                key,
                value,
              },
            });
            result.imported++;
          } else {
            const existing = await this.prisma.translationKey.findFirst({
              where: {
                namespaceId: namespace.id,
                languageId: language.id,
                key,
              },
            });

            if (!existing) {
              await this.prisma.translationKey.create({
                data: {
                  namespaceId: namespace.id,
                  languageId: language.id,
                  key,
                  value,
                },
              });
              result.imported++;
            } else {
              result.skipped++;
            }
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Failed to import key "${key}": ${errorMessage}`);
        }
      }

      this.invalidateCache(dto.namespace, dto.languageCode);
    } catch (error: unknown) {
      result.success = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(errorMessage);
    }

    return result;
  }

  async exportTranslations(dto: ExportTranslationsDto): Promise<any> {
    const where: any = {};

    if (dto.languageCode) {
      where.language = { code: dto.languageCode };
    }
    if (dto.namespace) {
      where.namespace = { name: dto.namespace };
    }

    const translations = await this.prisma.translationKey.findMany({
      where,
      include: {
        namespace: true,
        language: true,
      },
      orderBy: [
        { namespace: { name: 'asc' } },
        { key: 'asc' },
      ],
    });

    switch (dto.format) {
      case 'json':
        return this.exportAsJson(translations);
      case 'csv':
        return this.exportAsCsv(translations);
      case 'po':
        return this.exportAsPo(translations);
      default:
        throw new BadRequestException(`Unsupported format: ${dto.format}`);
    }
  }

  private exportAsJson(translations: any[]): Record<string, any> {
    const result: Record<string, Record<string, Record<string, string>>> = {};

    for (const t of translations) {
      const lang = t.language.code;
      const ns = t.namespace.name;

      if (!result[lang]) result[lang] = {};
      if (!result[lang][ns]) result[lang][ns] = {};
      result[lang][ns][t.key] = t.value;
    }

    return result;
  }

  private exportAsCsv(translations: any[]): string {
    const lines = ['namespace,key,language,value'];

    for (const t of translations) {
      const value = t.value.replace(/"/g, '""');
      lines.push(`"${t.namespace.name}","${t.key}","${t.language.code}","${value}"`);
    }

    return lines.join('\n');
  }

  private exportAsPo(translations: any[]): string {
    const lines: string[] = [];

    for (const t of translations) {
      lines.push(`#: ${t.namespace.name}`);
      lines.push(`msgid "${t.key}"`);
      lines.push(`msgstr "${t.value.replace(/"/g, '\\"')}"`);
      lines.push('');
    }

    return lines.join('\n');
  }

  // ============================================
  // STATISTICS
  // ============================================

  async getNamespaceStats(namespace: string): Promise<Record<string, TranslationStats>> {
    const ns = await this.findNamespaceByName(namespace);
    const languages = await this.getActiveLanguages();

    // Get all unique keys in this namespace
    const allKeys = await this.prisma.translationKey.findMany({
      where: { namespaceId: ns.id },
      select: { key: true },
      distinct: ['key'],
    });

    const totalKeys = allKeys.length;
    const stats: Record<string, TranslationStats> = {};

    for (const lang of languages) {
      const translations = await this.prisma.translationKey.findMany({
        where: {
          namespaceId: ns.id,
          languageId: lang.id,
        },
      });

      const translatedKeys = translations.length;
      const reviewedKeys = translations.filter((t: { isReviewed: boolean }) => t.isReviewed).length;
      const autoTranslatedKeys = translations.filter((t: { isAuto: boolean }) => t.isAuto).length;

      stats[lang.code] = {
        totalKeys,
        translatedKeys,
        reviewedKeys,
        autoTranslatedKeys,
        completionPercentage: totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0,
      };
    }

    return stats;
  }

  async getLanguageStats(): Promise<LanguageStats[]> {
    const languages = await this.getActiveLanguages();
    const stats: LanguageStats[] = [];

    // Get all unique keys across all namespaces
    const allKeys = await this.prisma.translationKey.findMany({
      select: { key: true, namespaceId: true },
      distinct: ['key', 'namespaceId'],
    });

    const totalKeys = allKeys.length;

    for (const lang of languages) {
      const translations = await this.prisma.translationKey.findMany({
        where: { languageId: lang.id },
      });

      const translatedKeys = translations.length;
      const reviewedKeys = translations.filter((t: { isReviewed: boolean }) => t.isReviewed).length;

      stats.push({
        code: lang.code,
        name: lang.name,
        totalKeys,
        translatedKeys,
        reviewedKeys,
        completionPercentage: totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0,
      });
    }

    return stats;
  }
}
