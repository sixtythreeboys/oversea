import { Module } from '@nestjs/common';
import { APIserverModule } from './APIserver/APIserver.module';
import { BatchModule } from './Batch/Batch.module';
import { KISLoopService } from './KIS/KIS.refreshLoop.service';
import { KISModule } from './KIS/KIS.module';

@Module({
  imports: [APIserverModule, BatchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
