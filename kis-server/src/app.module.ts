import { Module } from '@nestjs/common';
import { APIController } from './API.controller';

@Module({
  imports: [],
  controllers: [APIController],
  providers: [],
})
export class AppModule {}
