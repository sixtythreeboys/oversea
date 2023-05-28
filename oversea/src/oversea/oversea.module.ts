import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OverseaController } from './oversea.controller';
import { OverseaService } from './oversea.service';
import { HttpModule } from '@nestjs/axios';
import { checkTokenMiddleware } from './oversea.middleware';
import { OverseaGateway } from './oversea.gateway';
import { BatchService } from './batch/batch.service';

@Module({
  imports: [HttpModule],
  controllers: [OverseaController],
  providers: [OverseaService, OverseaGateway, BatchService],
})
export class OverseaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkTokenMiddleware).forRoutes('oversea');
  }
}
