import { Module } from '@nestjs/common';
import { OverseaController } from './oversea.controller';
import { OverseaService } from './oversea.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OverseaController],
  providers: [OverseaService],
})
export class OverseaModule {}
