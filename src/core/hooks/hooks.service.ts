import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateHookDto, RegisterListenerDto, UpdateListenerDto } from './dto';

export interface HookContext {
  hookName: string;
  module?: string;
  data: any;
  user?: any;
  metadata?: Record<string, any>;
}

export type HookHandler = (context: HookContext) => Promise<any>;

@Injectable()
export class HooksService {
  private readonly logger = new Logger(HooksService.name);
  private handlers: Map<string, { moduleSlug: string; handler: HookHandler; priority: number }[]> = new Map();

  constructor(private prisma: PrismaService) {}

  /**
   * Initialize hooks on startup
   */
  async initialize() {
    try {
      // Load registered listeners from database
      const listeners = await this.prisma.hookListener.findMany({
        where: { isEnabled: true },
        include: { hook: true },
        orderBy: { priority: 'asc' },
      });

      for (const listener of listeners) {
        this.registerInMemory(
          listener.hook.name,
          listener.moduleSlug,
          listener.handler,
          listener.priority
        );
      }

      this.logger.log(`Loaded ${listeners.length} hook listeners`);
    } catch (error: any) {
      // Handle case where tables don't exist yet
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        this.logger.warn('Hooks initialization skipped (tables may not exist yet)');
        this.logger.warn('Run "npx prisma db push" to create the required tables');
      } else {
        throw error;
      }
    }
  }

  /**
   * Get all hooks
   */
  async findAllHooks() {
    return this.prisma.hook.findMany({
      include: {
        listeners: {
          orderBy: { priority: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get hook by name
   */
  async findHookByName(name: string) {
    return this.prisma.hook.findUnique({
      where: { name },
      include: {
        listeners: {
          orderBy: { priority: 'asc' },
        },
      },
    });
  }

  /**
   * Create a hook
   */
  async createHook(dto: CreateHookDto) {
    return this.prisma.hook.create({
      data: dto,
    });
  }

  /**
   * Delete a hook
   */
  async deleteHook(name: string) {
    // Remove from memory
    this.handlers.delete(name);

    await this.prisma.hook.delete({
      where: { name },
    });

    return { success: true };
  }

  /**
   * Register a listener in database
   */
  async registerListener(dto: RegisterListenerDto) {
    // Ensure hook exists
    let hook = await this.prisma.hook.findUnique({
      where: { name: dto.hookName },
    });

    if (!hook) {
      hook = await this.prisma.hook.create({
        data: { name: dto.hookName },
      });
    }

    const listener = await this.prisma.hookListener.upsert({
      where: {
        hookId_moduleSlug: {
          hookId: hook.id,
          moduleSlug: dto.moduleSlug,
        },
      },
      update: {
        handler: dto.handler,
        priority: dto.priority ?? 10,
        isEnabled: dto.isEnabled ?? true,
      },
      create: {
        hookId: hook.id,
        moduleSlug: dto.moduleSlug,
        handler: dto.handler,
        priority: dto.priority ?? 10,
        isEnabled: dto.isEnabled ?? true,
      },
    });

    // Register in memory if enabled
    if (listener.isEnabled) {
      this.registerInMemory(dto.hookName, dto.moduleSlug, dto.handler, listener.priority);
    }

    return listener;
  }

  /**
   * Update a listener
   */
  async updateListener(id: string, dto: UpdateListenerDto) {
    const listener = await this.prisma.hookListener.update({
      where: { id },
      data: dto,
      include: { hook: true },
    });

    // Update in memory
    if (dto.isEnabled === false) {
      this.unregisterFromMemory(listener.hook.name, listener.moduleSlug);
    } else if (dto.isEnabled === true) {
      this.registerInMemory(
        listener.hook.name,
        listener.moduleSlug,
        listener.handler,
        listener.priority
      );
    }

    return listener;
  }

  /**
   * Remove a listener
   */
  async removeListener(hookName: string, moduleSlug: string) {
    const hook = await this.prisma.hook.findUnique({
      where: { name: hookName },
    });

    if (hook) {
      await this.prisma.hookListener.delete({
        where: {
          hookId_moduleSlug: {
            hookId: hook.id,
            moduleSlug,
          },
        },
      });
    }

    this.unregisterFromMemory(hookName, moduleSlug);
    return { success: true };
  }

  /**
   * Register handler in memory
   */
  private registerInMemory(
    hookName: string,
    moduleSlug: string,
    handlerName: string,
    priority: number = 10
  ) {
    const handlers = this.handlers.get(hookName) || [];
    
    // Remove existing handler for this module
    const filtered = handlers.filter(h => h.moduleSlug !== moduleSlug);
    
    // Add new handler
    const handler: HookHandler = async (context: HookContext) => {
      // In a real implementation, this would call the actual module handler
      this.logger.debug(`Hook ${hookName} executed by ${moduleSlug}`);
      return context.data;
    };

    filtered.push({ moduleSlug, handler, priority });
    filtered.sort((a, b) => a.priority - b.priority);
    
    this.handlers.set(hookName, filtered);
  }

  /**
   * Unregister handler from memory
   */
  private unregisterFromMemory(hookName: string, moduleSlug: string) {
    const handlers = this.handlers.get(hookName) || [];
    this.handlers.set(
      hookName,
      handlers.filter(h => h.moduleSlug !== moduleSlug)
    );
  }

  /**
   * Execute a hook (filter pattern - modifies data)
   */
  async executeFilter(hookName: string, data: any, context?: Partial<HookContext>): Promise<any> {
    const handlers = this.handlers.get(hookName);
    
    if (!handlers || handlers.length === 0) {
      return data;
    }

    let result = data;
    for (const { moduleSlug, handler } of handlers) {
      try {
        result = await handler({
          hookName,
          module: moduleSlug,
          data: result,
          user: context?.user,
          metadata: context?.metadata,
        });
      } catch (error) {
        this.logger.error(`Hook ${hookName} failed in module ${moduleSlug}:`, error);
      }
    }

    return result;
  }

  /**
   * Execute a hook (action pattern - no return value)
   */
  async executeAction(hookName: string, data: any, context?: Partial<HookContext>): Promise<void> {
    const handlers = this.handlers.get(hookName);
    
    if (!handlers || handlers.length === 0) {
      return;
    }

    for (const { moduleSlug, handler } of handlers) {
      try {
        await handler({
          hookName,
          module: moduleSlug,
          data,
          user: context?.user,
          metadata: context?.metadata,
        });
      } catch (error) {
        this.logger.error(`Hook ${hookName} failed in module ${moduleSlug}:`, error);
      }
    }
  }

  /**
   * Get registered hooks
   */
  getRegisteredHooks(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Get handlers for a hook
   */
  getHandlers(hookName: string) {
    return this.handlers.get(hookName) || [];
  }

  /**
   * Check if hook has handlers
   */
  hasHandlers(hookName: string): boolean {
    const handlers = this.handlers.get(hookName);
    return handlers !== undefined && handlers.length > 0;
  }

  /**
   * Get available system hooks
   */
  getSystemHooks() {
    return [
      // Article hooks
      { name: 'article.beforeCreate', description: 'Before article creation' },
      { name: 'article.afterCreate', description: 'After article creation' },
      { name: 'article.beforeUpdate', description: 'Before article update' },
      { name: 'article.afterUpdate', description: 'After article update' },
      { name: 'article.beforeDelete', description: 'Before article deletion' },
      { name: 'article.afterDelete', description: 'After article deletion' },
      { name: 'article.beforePublish', description: 'Before article publish' },
      { name: 'article.afterPublish', description: 'After article publish' },
      
      // User hooks
      { name: 'user.beforeLogin', description: 'Before user login' },
      { name: 'user.afterLogin', description: 'After user login' },
      { name: 'user.afterRegister', description: 'After user registration' },
      
      // Media hooks
      { name: 'media.beforeUpload', description: 'Before media upload' },
      { name: 'media.afterUpload', description: 'After media upload' },
      
      // Page hooks
      { name: 'page.beforeCreate', description: 'Before page creation' },
      { name: 'page.afterCreate', description: 'After page creation' },
      { name: 'page.beforeUpdate', description: 'Before page update' },
      { name: 'page.afterUpdate', description: 'After page update' },
      
      // System hooks
      { name: 'system.init', description: 'System initialization' },
      { name: 'system.shutdown', description: 'System shutdown' },
      { name: 'cron.daily', description: 'Daily cron job' },
      { name: 'cron.hourly', description: 'Hourly cron job' },
    ];
  }
}
