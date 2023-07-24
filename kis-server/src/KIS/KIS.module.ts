import { Module } from '@nestjs/common';
import { KISApiService } from './KIS.API.service';

@Module({
  providers: [KISApiService],
  exports: [KISApiService],
})
export class KISModule {}
