import { Module } from '@nestjs/common';
import { APIController } from 'src/APIserver/APIserver.controller';
import { APIserverGateway } from 'src/APIserver/APIserver.gateway';
import { KISModule } from 'src/KIS/KIS.module';

@Module({
  imports: [KISModule],
  controllers: [APIController],
  providers: [APIserverGateway],
})
export class APIserverModule {}
