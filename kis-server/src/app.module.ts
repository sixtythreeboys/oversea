import { Module } from '@nestjs/common';
import { APIController } from 'src/APIserver/APIserver.controller';
import { APIserverGateway } from 'src/APIserver/APIserver.gateway';
import { APIService } from './KIS/KIS.API.service';
import { LoopService } from './KIS/KIS.refreshLoop.service';

@Module({
  imports: [],
  controllers: [APIController],
  providers: [APIserverGateway, APIService, LoopService],
})
export class AppModule {}
