import { Module } from '@nestjs/common';
import { BreakingNewsController } from './breaking-news.controller';
import { BreakingNewsService } from './breaking-news.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BreakingNewsController],
  providers: [BreakingNewsService],
  exports: [BreakingNewsService],
})
export class BreakingNewsModule {}
