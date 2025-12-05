import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { 
  CreateThemeDto, 
  UpdateThemeDto, 
  UpdateThemeSettingsDto,
  ThemeQueryDto 
} from './dto';
import { 
  ThemeManifest, 
  ThemeValidationResult, 
  ActiveTheme,
  ThemeSettings 
} from './interfaces/theme.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);
  private activeThemeCache: ActiveTheme | null = null;

  constructor(private prisma: PrismaService) {}

  /**
   * Get all installed themes
   */
  async findAll(query?: ThemeQueryDto) {
    const where: any = {};
    
    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query?.isDefault !== undefined) {
      where.isDefault = query.isDefault;
    }

    return this.prisma.theme.findMany({
      where,
      orderBy: [
        { isActive: 'desc' },
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
      include: {
        themeSettings: true,
      },
    });
  }

  /**
   * Get theme by slug
   */
  async findBySlug(slug: string) {
    const theme = await this.prisma.theme.findUnique({
      where: { slug },
      include: {
        themeSettings: true,
      },
    });

    if (!theme) {
      throw new NotFoundException(`Theme with slug "${slug}" not found`);
    }

    return theme;
  }

  /**
   * Get active theme
   */
  async getActiveTheme(): Promise<ActiveTheme | null> {
    if (this.activeThemeCache) {
      return this.activeThemeCache;
    }

    const theme = await this.prisma.theme.findFirst({
      where: { isActive: true },
      include: {
        themeSettings: true,
      },
    });

    if (!theme) {
      return null;
    }

    // Convert settings to key-value object
    const settings: ThemeSettings = {};
    for (const setting of theme.themeSettings) {
      settings[setting.key] = setting.value;
    }

    this.activeThemeCache = {
      id: theme.id,
      slug: theme.slug,
      name: theme.name,
      version: theme.version,
      path: theme.path,
      manifest: theme.manifest as unknown as ThemeManifest,
      settings,
    };

    return this.activeThemeCache;
  }

  /**
   * Clear active theme cache
   */
  clearCache() {
    this.activeThemeCache = null;
  }

  /**
   * Install a new theme
   */
  async install(dto: CreateThemeDto) {
    // Check if theme already exists
    const existing = await this.prisma.theme.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException(`Theme with slug "${dto.slug}" already exists`);
    }

    // Validate manifest
    const validation = this.validateManifest(dto.manifest as unknown as ThemeManifest);
    if (!validation.valid) {
      throw new BadRequestException(`Invalid theme manifest: ${validation.errors.join(', ')}`);
    }

    // Create theme
    const theme = await this.prisma.theme.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        version: dto.version,
        author: dto.author,
        description: dto.description,
        manifest: dto.manifest,
        path: dto.path,
        features: dto.features || [],
        isDefault: dto.isDefault || false,
        defaultSettings: (dto.manifest as any).customizer?.sections?.reduce((acc: any, section: any) => {
          section.fields?.forEach((field: any) => {
            if (field.default !== undefined) {
              acc[field.id] = field.default;
            }
          });
          return acc;
        }, {}) || {},
      },
    });

    this.logger.log(`Theme "${dto.name}" installed successfully`);
    return theme;
  }

  /**
   * Uninstall a theme
   */
  async uninstall(slug: string) {
    const theme = await this.findBySlug(slug);

    if (theme.isSystem) {
      throw new BadRequestException('Cannot uninstall system theme');
    }

    if (theme.isActive) {
      throw new BadRequestException('Cannot uninstall active theme. Please activate another theme first.');
    }

    await this.prisma.theme.delete({
      where: { slug },
    });

    this.logger.log(`Theme "${theme.name}" uninstalled`);
    return { success: true };
  }

  /**
   * Activate a theme
   */
  async activate(slug: string) {
    const theme = await this.findBySlug(slug);

    // Deactivate all themes first
    await this.prisma.theme.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the selected theme
    const updatedTheme = await this.prisma.theme.update({
      where: { slug },
      data: {
        isActive: true,
        activatedAt: new Date(),
      },
    });

    // Clear cache
    this.clearCache();

    this.logger.log(`Theme "${theme.name}" activated`);
    return updatedTheme;
  }

  /**
   * Deactivate a theme
   */
  async deactivate(slug: string) {
    const theme = await this.findBySlug(slug);

    if (!theme.isActive) {
      throw new BadRequestException('Theme is not active');
    }

    // Check if there's a default theme to fall back to
    const defaultTheme = await this.prisma.theme.findFirst({
      where: { isDefault: true, slug: { not: slug } },
    });

    await this.prisma.theme.update({
      where: { slug },
      data: { isActive: false },
    });

    // Activate default theme if exists
    if (defaultTheme) {
      await this.activate(defaultTheme.slug);
    }

    this.clearCache();
    return { success: true };
  }

  /**
   * Update theme settings
   */
  async updateSettings(slug: string, dto: UpdateThemeSettingsDto) {
    const theme = await this.findBySlug(slug);

    // Upsert each setting
    const operations = Object.entries(dto.settings).map(([key, value]) => {
      return this.prisma.themeSetting.upsert({
        where: {
          themeId_key: {
            themeId: theme.id,
            key,
          },
        },
        update: { value },
        create: {
          themeId: theme.id,
          key,
          value,
          type: typeof value === 'boolean' ? 'toggle' : 
                typeof value === 'number' ? 'number' : 'text',
        },
      });
    });

    await this.prisma.$transaction(operations);

    // Clear cache if active theme
    if (theme.isActive) {
      this.clearCache();
    }

    return this.findBySlug(slug);
  }

  /**
   * Get theme settings
   */
  async getSettings(slug: string) {
    const theme = await this.findBySlug(slug);
    
    const settings: Record<string, any> = {};
    for (const setting of theme.themeSettings) {
      settings[setting.key] = setting.value;
    }

    // Merge with defaults
    const defaults = theme.defaultSettings as Record<string, any> || {};
    return { ...defaults, ...settings };
  }

  /**
   * Reset theme settings to defaults
   */
  async resetSettings(slug: string) {
    const theme = await this.findBySlug(slug);

    await this.prisma.themeSetting.deleteMany({
      where: { themeId: theme.id },
    });

    if (theme.isActive) {
      this.clearCache();
    }

    return this.findBySlug(slug);
  }

  /**
   * Validate theme manifest
   */
  validateManifest(manifest: ThemeManifest): ThemeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!manifest.id) errors.push('Missing theme id');
    if (!manifest.name) errors.push('Missing theme name');
    if (!manifest.version) errors.push('Missing theme version');
    if (!manifest.templates || manifest.templates.length === 0) {
      warnings.push('No templates defined');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Discover themes from filesystem
   */
  async discoverThemes(themesDir: string): Promise<ThemeManifest[]> {
    const themes: ThemeManifest[] = [];

    if (!fs.existsSync(themesDir)) {
      return themes;
    }

    const dirs = fs.readdirSync(themesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dir of dirs) {
      const manifestPath = path.join(themesDir, dir, 'theme.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          themes.push(manifest);
        } catch (error) {
          this.logger.warn(`Failed to read theme manifest: ${manifestPath}`);
        }
      }
    }

    return themes;
  }

  /**
   * Get theme templates
   */
  async getTemplates(slug: string) {
    const theme = await this.findBySlug(slug);
    const manifest = theme.manifest as unknown as ThemeManifest;
    return manifest.templates || [];
  }

  /**
   * Get theme regions
   */
  async getRegions(slug: string) {
    const theme = await this.findBySlug(slug);
    const manifest = theme.manifest as unknown as ThemeManifest;
    return manifest.regions || [];
  }

  /**
   * Export theme settings
   */
  async exportSettings(slug: string) {
    const settings = await this.getSettings(slug);
    return {
      slug,
      exportedAt: new Date().toISOString(),
      settings,
    };
  }

  /**
   * Import theme settings
   */
  async importSettings(slug: string, settings: Record<string, any>) {
    return this.updateSettings(slug, { settings });
  }
}
