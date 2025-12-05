import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule implements OnModuleInit {
  private readonly logger = new Logger(ModulesModule.name);
  
  constructor(private readonly modulesService: ModulesService) {}

  async onModuleInit() {
    // Initialize modules on startup - with error handling for missing tables
    try {
      await this.modulesService.initialize();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Modules initialization skipped (tables may not exist yet): ${errorMessage}`);
      this.logger.warn('Run "npx prisma db push" to create the required tables');
    }
  }
}
