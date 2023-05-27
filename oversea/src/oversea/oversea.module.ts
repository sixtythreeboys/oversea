import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OverseaController } from './oversea.controller';
import { OverseaService } from './oversea.service';
import { HttpModule } from '@nestjs/axios';
import { checkTokenMiddleware } from './oversea.middleware';
import { OverseaGateway } from './oversea.gateway';
import { DBService } from 'src/DB/DB.service';

@Module({
  imports: [HttpModule],
  controllers: [OverseaController],
  providers: [OverseaService, OverseaGateway, DBService],
})
export class OverseaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkTokenMiddleware).forRoutes('oversea');
  }
}
