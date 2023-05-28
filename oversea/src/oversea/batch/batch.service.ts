import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { updateToken } from '../oversea.middleware';
import { exeQuery } from 'src/DB/DB.service';

@Injectable()
export class BatchService {
  private job: CronJob;

  constructor(
    @Inject(OverseaService) private readonly oversea: OverseaService,
  ) {
    //this.moduleInit();
  }
  async moduleInit() {
    // Access and use the MyService within the initialization logic
    await updateToken();
    // this.job = new CronJob('0 0 1 * * *', async () => {
    //   this.updateUpDown();
    // });
    // this.job.start();

    this.updateUpDown();
  }
  async updateUpDown() {
    const res: [] = (await exeQuery(
      `select distinct excd, symb from OVERSEA_ITEM_MAST;`,
    )) as [];
    for (const { excd, symb } of res) {
      console.log(excd, symb);
      //this.oversea.getDetail();
    }
  }
}
