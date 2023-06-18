import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { updateToken } from '../oversea.middleware';
import { getDateList, getToday } from 'src/common/util/dateUtils';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { fillEmpty as fill_updateTradingDate } from './batch.updateTradingDate';
import { fillEmpty as fill_updateDetailInfo } from './batch.updateDetailInfo';
import { fillEmpty_NAS as fill_updateUpDown } from './batch.updateUpDown';

@Injectable()
export class BatchService {
  private job: CronJob;

  constructor(
    @Inject(OverseaService) private readonly oversea: OverseaService,
  ) {
    //this.moduleInit();
    temp().then((e) => console.log(`temp done`));
  }
  async moduleInit() {
    await updateToken();
    this.job = new CronJob('0 0 1 * * *', async () => {
      // 매일 1시 실행
    });
    this.job.start();
  }
}

async function temp() {
  await updateToken();
  const TODAY = getToday();
  //await fill_updateTradingDate(TODAY);
  // await fill_updateDetailInfo(TODAY);
  await fill_updateUpDown(TODAY);
}
