import { Module } from '@nestjs/common';
import { APIController } from './API.controller';
import { APIserverGateway } from './APIserver.gateway';
import { APIService } from './KIS/KIS.API.service';
import { LoopService } from './KIS/KIS.refreshLoop.service';

@Module({
  imports: [],
  controllers: [APIController],
  providers: [APIserverGateway, APIService, LoopService],
})
export class AppModule {}
