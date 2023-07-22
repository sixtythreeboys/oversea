import { Module } from '@nestjs/common';
import { OverseaController } from './oversea.controller';
import { OverseaService } from './oversea.service';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from 'src/KISserver/KISserver.apis';
import { WebsocketsClient } from 'src/KISserver/KISserver.WebsocketsClient';

@Module({
  imports: [HttpModule],
  controllers: [OverseaController],
  providers: [OverseaService, ApiService, WebsocketsClient],
})
export class OverseaModule {}
