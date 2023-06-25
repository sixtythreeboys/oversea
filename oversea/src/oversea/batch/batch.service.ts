import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { updateToken } from '../oversea.middleware';
import {
  addDaysToDate,
  getDateDiff,
  getDateList,
  getToday,
} from 'src/common/util/dateUtils';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { fillEmpty as fill_updateTradingDate } from './batch.updateTradingDate';
import { fillEmpty as fill_updateDetailInfo } from './batch.updateDetailInfo';
import { fillEmpty_NAS as fill_updateUpDown } from './batch.updateUpDown';
import { APIS } from 'src/KIS/KISAPIS';

@Injectable()
export class BatchService {
  private job: CronJob;

  constructor(
    @Inject(OverseaService) private readonly oversea: OverseaService,
  ) {
    this.moduleInit();
  }
  async moduleInit() {
    await updateToken();

    const TODAY = getToday();
    // await fill_updateTradingDate(TODAY);
    // await fill_updateDetailInfo(TODAY);
    await fill_updateUpDown(TODAY);

    this.job = new CronJob('0 0 2 * * *', async () => {
      const TODAY = getToday();
      await fill_updateTradingDate(TODAY);
      await fill_updateDetailInfo(TODAY);
      await fill_updateUpDown(TODAY);
    });
    this.job.start();
  }
}
async function batchPack(TODAY) {
  await updateToken();
}
