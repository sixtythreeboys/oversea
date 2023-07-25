import { Module } from '@nestjs/common';
import { APIserverModule } from './APIserver/APIserver.module';
import { BatchModule } from './Batch/Batch.module';
import { KISModule } from './KIS/KIS.module';
import { KISLoopService } from './KIS/KIS.refreshLoop.service';

@Module({
  imports: [APIserverModule, BatchModule, KISModule],
  controllers: [],
  providers: [KISLoopService],
})
export class AppModule {}
