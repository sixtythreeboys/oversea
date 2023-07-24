import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { updateToken } from 'src/KIS/KIS.middleware';
import { BatchUpdateContinuous } from './Batch.updateContinuous';
@Injectable()
export class BatchService {
  private job: CronJob;
  onDoing: boolean;
  constructor(private readonly batchUpdateContinuous: BatchUpdateContinuous) {
    this.onDoing = false;
    try {
      this.moduleInit();
    } catch (e) {
      console.log(e);
    }
  }
  async moduleInit() {
    await updateToken();

    this.job = new CronJob('0 0 2 * * *', this.batchBundle());
    this.job.start();

    await this.batchBundle();
  }

  async batchBundle() {
    if (this.onDoing) return;
    this.onDoing = true;
    await this.batchUpdateContinuous.updateContinuous(new Date());
    this.onDoing = false;
  }
}
