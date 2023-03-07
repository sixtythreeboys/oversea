import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class DBModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
