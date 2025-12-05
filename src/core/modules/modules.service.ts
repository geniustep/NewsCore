import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { 
  CreateModuleDto, 
  UpdateModuleDto, 
  UpdateModuleSettingsDto,
  ModuleQueryDto,
  ModuleType,
} from './dto';
import { 
  ModuleManifest, 
  ModuleValidationResult, 
  LoadedModule,
  ModuleSettings,
  ModuleHookContext,
  HookHandler,
} from './interfaces/module.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);
  private loadedModules: Map<string, LoadedModule> = new Map();
  private hookHandlers: Map<string, { moduleSlug: string; handler: HookHandler; priority: number }[]> = new Map();

  constructor(private prisma: PrismaService) {}

  /**
   * Initialize modules on startup
   */
  async initialize() {
    const enabledModules = await this.prisma.module.findMany({
      where: { isEnabled: true, isInstalled: true },
      include: { moduleSettings: true },
    });

    for (const module of enabledModules) {
      await this.loadModule(module);
    }

    this.logger.log(`Loaded ${this.loadedModules.size} modules`);
  }

  /**
   * Load a module into memory
   */
  private async loadModule(module: any) {
    const settings: ModuleSettings = {};
    for (const setting of module.moduleSettings || []) {
      settings[setting.key] = setting.value;
    }

    const loadedModule: LoadedModule = {
      id: module.id,
      slug: module.slug,
      name: module.name,
      version: module.version,
      type: module.type,
      path: module.path,
      manifest: module.manifest as ModuleManifest,
      settings,
      isEnabled: module.isEnabled,
    };

    this.loadedModules.set(module.slug, loadedModule);

    // Register hooks
    const manifest = module.manifest as ModuleManifest;
    if (manifest.hooks) {
      for (const hook of manifest.hooks) {
        await this.registerHookHandler(hook.name, module.slug, hook.handler, hook.priority);
      }
    }
  }

  /**
   * Unload a module from memory
   */
  private unloadModule(slug: string) {
    this.loadedModules.delete(slug);
    
    // Remove hook handlers for this module
    for (const [hookName, handlers] of this.hookHandlers.entries()) {
      this.hookHandlers.set(
        hookName,
        handlers.filter(h => h.moduleSlug !== slug)
      );
    }
  }

  /**
   * Get all modules
   */
  async findAll(query?: ModuleQueryDto) {
    const where: any = {};
    
    if (query?.type) {
      where.type = query.type;
    }
    if (query?.isEnabled !== undefined) {
      where.isEnabled = query.isEnabled;
    }
    if (query?.isCore !== undefined) {
      where.isCore = query.isCore;
    }

    return this.prisma.module.findMany({
      where,
      orderBy: [
        { isCore: 'desc' },
        { type: 'asc' },
        { name: 'asc' },
      ],
      include: {
        moduleSettings: true,
      },
    });
  }

  /**
   * Get module by slug
   */
  async findBySlug(slug: string) {
    const module = await this.prisma.module.findUnique({
      where: { slug },
      include: {
        moduleSettings: true,
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with slug "${slug}" not found`);
    }

    return module;
  }

  /**
   * Get loaded module
   */
  getLoadedModule(slug: string): LoadedModule | undefined {
    return this.loadedModules.get(slug);
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules(): LoadedModule[] {
    return Array.from(this.loadedModules.values());
  }

  /**
   * Install a new module
   */
  async install(dto: CreateModuleDto) {
    // Check if module already exists
    const existing = await this.prisma.module.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException(`Module with slug "${dto.slug}" already exists`);
    }

    // Validate manifest
    const validation = this.validateManifest(dto.manifest as ModuleManifest);
    if (!validation.valid) {
      throw new BadRequestException(`Invalid module manifest: ${validation.errors.join(', ')}`);
    }

    // Check dependencies
    if (dto.dependencies && dto.dependencies.length > 0) {
      const missingDeps = await this.checkDependencies(dto.dependencies);
      if (missingDeps.length > 0) {
        throw new BadRequestException(`Missing dependencies: ${missingDeps.join(', ')}`);
      }
    }

    // Create module
    const module = await this.prisma.module.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        version: dto.version,
        author: dto.author,
        description: dto.description,
        icon: dto.icon,
        type: dto.type,
        manifest: dto.manifest,
        path: dto.path,
        dependencies: dto.dependencies || [],
        isCore: dto.isCore || false,
        isSystem: dto.isSystem || false,
        isInstalled: true,
        installedAt: new Date(),
        defaultSettings: (dto.manifest as any).settings?.reduce((acc: any, setting: any) => {
          if (setting.default !== undefined) {
            acc[setting.key] = setting.default;
          }
          return acc;
        }, {}) || {},
      },
    });

    // Register permissions if provided
    const manifest = dto.manifest as ModuleManifest;
    if (manifest.provides?.permissions) {
      await this.registerPermissions(manifest.provides.permissions);
    }

    this.logger.log(`Module "${dto.name}" installed successfully`);
    return module;
  }

  /**
   * Uninstall a module
   */
  async uninstall(slug: string) {
    const module = await this.findBySlug(slug);

    if (module.isSystem) {
      throw new BadRequestException('Cannot uninstall system module');
    }

    if (module.isCore) {
      throw new BadRequestException('Cannot uninstall core module');
    }

    // Check if other modules depend on this
    const dependents = await this.prisma.module.findMany({
      where: {
        dependencies: { has: slug },
        isEnabled: true,
      },
    });

    if (dependents.length > 0) {
      throw new BadRequestException(
        `Cannot uninstall: modules depend on this: ${dependents.map((d: { name: string }) => d.name).join(', ')}`
      );
    }

    // Disable first if enabled
    if (module.isEnabled) {
      await this.disable(slug);
    }

    await this.prisma.module.delete({
      where: { slug },
    });

    this.logger.log(`Module "${module.name}" uninstalled`);
    return { success: true };
  }

  /**
   * Enable a module
   */
  async enable(slug: string) {
    const module = await this.findBySlug(slug);

    if (module.isEnabled) {
      return module;
    }

    // Check dependencies
    if (module.dependencies && module.dependencies.length > 0) {
      const disabledDeps = await this.prisma.module.findMany({
        where: {
          slug: { in: module.dependencies },
          isEnabled: false,
        },
      });

      if (disabledDeps.length > 0) {
        throw new BadRequestException(
          `Required modules are disabled: ${disabledDeps.map((d: { name: string }) => d.name).join(', ')}`
        );
      }
    }

    const updatedModule = await this.prisma.module.update({
      where: { slug },
      data: {
        isEnabled: true,
        enabledAt: new Date(),
      },
      include: { moduleSettings: true },
    });

    // Load module into memory
    await this.loadModule(updatedModule);

    this.logger.log(`Module "${module.name}" enabled`);
    return updatedModule;
  }

  /**
   * Disable a module
   */
  async disable(slug: string) {
    const module = await this.findBySlug(slug);

    if (!module.isEnabled) {
      return module;
    }

    if (module.isSystem) {
      throw new BadRequestException('Cannot disable system module');
    }

    // Check if other enabled modules depend on this
    const dependents = await this.prisma.module.findMany({
      where: {
        dependencies: { has: slug },
        isEnabled: true,
      },
    });

    if (dependents.length > 0) {
      throw new BadRequestException(
        `Cannot disable: enabled modules depend on this: ${dependents.map((d: { name: string }) => d.name).join(', ')}`
      );
    }

    const updatedModule = await this.prisma.module.update({
      where: { slug },
      data: {
        isEnabled: false,
        enabledAt: null,
      },
    });

    // Unload module from memory
    this.unloadModule(slug);

    this.logger.log(`Module "${module.name}" disabled`);
    return updatedModule;
  }

  /**
   * Update module settings
   */
  async updateSettings(slug: string, dto: UpdateModuleSettingsDto) {
    const module = await this.findBySlug(slug);

    // Upsert each setting
    const operations = Object.entries(dto.settings).map(([key, value]) => {
      return this.prisma.moduleSetting.upsert({
        where: {
          moduleId_key: {
            moduleId: module.id,
            key,
          },
        },
        update: { value },
        create: {
          moduleId: module.id,
          key,
          value,
          type: typeof value === 'boolean' ? 'boolean' : 
                typeof value === 'number' ? 'number' : 'string',
        },
      });
    });

    await this.prisma.$transaction(operations);

    // Update in-memory module settings
    const loadedModule = this.loadedModules.get(slug);
    if (loadedModule) {
      Object.assign(loadedModule.settings, dto.settings);
    }

    return this.findBySlug(slug);
  }

  /**
   * Get module settings
   */
  async getSettings(slug: string) {
    const module = await this.findBySlug(slug);
    
    const settings: Record<string, any> = {};
    for (const setting of module.moduleSettings) {
      settings[setting.key] = setting.value;
    }

    // Merge with defaults
    const defaults = module.defaultSettings as Record<string, any> || {};
    return { ...defaults, ...settings };
  }

  /**
   * Validate module manifest
   */
  validateManifest(manifest: ModuleManifest): ModuleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!manifest.id) errors.push('Missing module id');
    if (!manifest.name) errors.push('Missing module name');
    if (!manifest.version) errors.push('Missing module version');
    if (!manifest.type) errors.push('Missing module type');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check dependencies
   */
  async checkDependencies(dependencies: string[]): Promise<string[]> {
    const missing: string[] = [];

    for (const dep of dependencies) {
      const module = await this.prisma.module.findUnique({
        where: { slug: dep },
      });
      if (!module || !module.isInstalled) {
        missing.push(dep);
      }
    }

    return missing;
  }

  /**
   * Register permissions from module
   */
  private async registerPermissions(permissions: any[]) {
    for (const perm of permissions) {
      await this.prisma.permission.upsert({
        where: {
          module_action: {
            module: perm.module,
            action: perm.action,
          },
        },
        update: {
          displayName: perm.displayName,
          description: perm.description,
        },
        create: {
          name: perm.name,
          displayName: perm.displayName,
          description: perm.description,
          module: perm.module,
          action: perm.action,
        },
      });
    }
  }

  /**
   * Discover modules from filesystem
   */
  async discoverModules(modulesDir: string): Promise<ModuleManifest[]> {
    const modules: ModuleManifest[] = [];

    if (!fs.existsSync(modulesDir)) {
      return modules;
    }

    const dirs = fs.readdirSync(modulesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dir of dirs) {
      const manifestPath = path.join(modulesDir, dir, 'module.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          modules.push(manifest);
        } catch (error) {
          this.logger.warn(`Failed to read module manifest: ${manifestPath}`);
        }
      }
    }

    return modules;
  }

  // ============================================
  // HOOK SYSTEM
  // ============================================

  /**
   * Register a hook handler
   */
  async registerHookHandler(
    hookName: string, 
    moduleSlug: string, 
    handlerName: string,
    priority: number = 10
  ) {
    // Create hook if not exists
    await this.prisma.hook.upsert({
      where: { name: hookName },
      update: {},
      create: { name: hookName },
    });

    // For now, we just store the handler name
    // In a real implementation, you would resolve the actual handler function
    const handlers = this.hookHandlers.get(hookName) || [];
    handlers.push({
      moduleSlug,
      handler: async (context: ModuleHookContext) => {
        // This would call the actual module handler
        this.logger.debug(`Hook ${hookName} called by ${moduleSlug}`);
        return context.data;
      },
      priority,
    });

    // Sort by priority
    handlers.sort((a, b) => a.priority - b.priority);
    this.hookHandlers.set(hookName, handlers);
  }

  /**
   * Execute a hook
   */
  async executeHook(hookName: string, data: any, user?: any): Promise<any> {
    const handlers = this.hookHandlers.get(hookName);
    
    if (!handlers || handlers.length === 0) {
      return data;
    }

    let result = data;
    for (const { moduleSlug, handler } of handlers) {
      const loadedModule = this.loadedModules.get(moduleSlug);
      if (loadedModule?.isEnabled) {
        try {
          result = await handler({
            module: moduleSlug,
            data: result,
            user,
          });
        } catch (error) {
          this.logger.error(`Hook ${hookName} failed in module ${moduleSlug}:`, error);
        }
      }
    }

    return result;
  }

  /**
   * Get all registered hooks
   */
  getRegisteredHooks(): string[] {
    return Array.from(this.hookHandlers.keys());
  }

  /**
   * Get handlers for a hook
   */
  getHookHandlers(hookName: string) {
    return this.hookHandlers.get(hookName) || [];
  }
}
