import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { APIS } from 'src/KIS/KISAPIS';
import { updateToken } from '../oversea.middleware';
import { exeQuery } from 'src/DB/DB.service';
import { writeFileSync } from 'fs';
import { mergeList } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { dbModel } from 'src/DB/DB.model';

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
            console.log(e);
            return null;
          });
        console.log(excd, symb);
        if (detail === null) {
          console.log(excd, symb, '종목가격정보 조회 실패');
          return null;
        } else {
          detail.excd = excd;
          detail.symb = symb;
        }
        return detail;
      }),
    ).then((dataList) => dataList.filter((e) => e));

    if (await mergeList(dataList)) {
      console.log(
        `${dataList.length} items inserted into OVERSEA_HHDFS76240000.`,
      );
      dbModel.connection.commit();
    } else {
      console.log('insert failed');
    }
  }
}
