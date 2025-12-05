import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

// Database
import { DatabaseModule } from './database/database.module';

// Core System Modules (Themes, Modules, i18n, Hooks, Widgets)
import { ThemesModule } from './core/themes/themes.module';
import { ModulesModule } from './core/modules/modules.module';
import { I18nModule } from './core/i18n/i18n.module';
import { HooksModule } from './core/hooks/hooks.module';
import { WidgetsModule } from './core/widgets/widgets.module';

// Feature Modules
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { MediaModule } from './modules/media/media.module';
import { MenusModule } from './modules/menus/menus.module';
import { PagesModule } from './modules/pages/pages.module';
import { SettingsModule } from './modules/settings/settings.module';
import { BreakingNewsModule } from './modules/breaking-news/breaking-news.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

import { AppController } from './app.controller';
import { JwtAuthGuard } from './modules/auth/guards';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CorsInterceptor } from './common/interceptors/cors.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      expandVariables: true,
    }),
    
    // Static Files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    // Database
    DatabaseModule,
    
    // Core System (Plugin Architecture)
    ThemesModule,      // Theme Management
    ModulesModule,     // Module/Plugin Management
    I18nModule,        // Translation Management
    HooksModule,       // Event Hooks System
    WidgetsModule,     // Widget Management
    
    // Feature Modules
    HealthModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    TagsModule,
    MediaModule,
    MenusModule,
    PagesModule,
    SettingsModule,
    BreakingNewsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CorsInterceptor,
    },
  ],
})
export class AppModule {}
