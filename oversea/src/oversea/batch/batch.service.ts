import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { APIS } from 'src/KIS/KISAPIS';
import { updateToken } from '../oversea.middleware';
import { exeQuery } from 'src/DB/DB.service';
import { writeFileSync } from 'fs';

@Injectable()
export class BatchService {
  private job: CronJob;

  constructor(
    @Inject(OverseaService) private readonly oversea: OverseaService,
  ) {
    this.moduleInit();
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
    let dataList: any[] = (await exeQuery(
      `select distinct excd, symb from OVERSEA_ITEM_MAST;`,
    )) as [];
    dataList = await Promise.all(
      dataList.map(async ({ excd, symb }) => {
        const detail: any = await APIS.HHDFS76240000(
          {
            EXCD: excd,
            SYMB: symb,
            GUBN: '0',
            name: '-',
          } as any,
          1,
        )
          .then((detail: any) => (detail.length > 0 ? detail[0] : null))
          .catch((e) => {
            console.log(excd, symb);
            console.log(e);
          });
        console.log(excd, symb);
        if (detail === null) {
          console.log(excd, symb, '종목가격정보 조회 실패');
          return null;
        }
        return detail;
      }),
    ).then((e) => e.filter((e) => e !== null));
    writeFileSync('output', JSON.stringify(dataList, null, 2), 'utf8');
  }
}
