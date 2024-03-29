import { Module } from '@nestjs/common';
import { OverseaController } from './oversea.controller';
import { OverseaService } from './oversea.service';
import { OverseaGateway } from './oversea.gateway';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from 'src/KISserver/KISserver.apis';
import { WebsocketsClient } from 'src/KISserver/KISserver.WebsocketsClient';

@Module({
  imports: [HttpModule],
  controllers: [OverseaController],
  providers: [OverseaService, ApiService, WebsocketsClient, OverseaGateway],
})
export class OverseaModule {}
