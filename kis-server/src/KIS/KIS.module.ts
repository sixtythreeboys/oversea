import { Module } from '@nestjs/common';
import { KISApiService } from './KIS.API.service';
import { KISLoopService } from './KIS.refreshLoop.service';

@Module({
  providers: [KISApiService, KISLoopService],
  exports: [KISApiService, KISLoopService],
})
export class KISModule {}
