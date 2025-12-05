import { Module, OnModuleInit } from '@nestjs/common';
import { HooksController } from './hooks.controller';
import { HooksService } from './hooks.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HooksController],
  providers: [HooksService],
  exports: [HooksService],
})
export class HooksModule implements OnModuleInit {
  constructor(private readonly hooksService: HooksService) {}

  async onModuleInit() {
    await this.hooksService.initialize();
  }
}
