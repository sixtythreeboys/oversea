import { Module } from '@nestjs/common';
import { BatchService } from './Batch.service';
import { BatchUpdateContinuous } from './Batch.updateContinuous';
import { KISModule } from 'src/KIS/KIS.module';

@Module({
  imports: [KISModule],
  controllers: [],
  providers: [BatchService, BatchUpdateContinuous],
})
export class BatchModule {}
