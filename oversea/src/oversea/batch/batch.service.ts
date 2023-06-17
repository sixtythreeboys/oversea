import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { updateToken } from '../oversea.middleware';
import { getDateList, getToday } from 'src/common/util/dateUtils';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { fillEmpty as fill_updateTradingDate } from './batch.updateTradingDate';

@Injectable()
export class BatchService {
  private job: CronJob;

  constructor(
    @Inject(OverseaService) private readonly oversea: OverseaService,
  ) {
    //this.moduleInit();
    temp();
  }
  async moduleInit() {
    await updateToken();
    // Access and use the MyService within the initialization logic
    this.job = new CronJob('0 0 1 * * *', async () => {
      const TODAY = getToday();
      fill_updateTradingDate(TODAY);
      (async function () {
        const dateList = getDateList(
          await OVERSEA_HHDFS76240000.getLastDay(),
          getToday(),
        );
        for (const date of dateList) {
          this.updateDetailInfo(date).catch((e) => console.log(e));
        }
      }.call(this));
    });
    this.job.start();
  }
}

async function temp() {
  await updateToken();
  const TODAY = getToday();
  fill_updateTradingDate(TODAY);
}
