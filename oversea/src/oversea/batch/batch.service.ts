import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { APIS } from 'src/KIS/KISAPIS';
import { updateToken } from '../oversea.middleware';
import { exeQuery } from 'src/DB/DB.service';

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

    //this.updateUpDown();
  }
  async updateUpDown() {
    const res: [] = (await exeQuery(
      `select distinct excd, symb from OVERSEA_ITEM_MAST;`,
    )) as [];

    for (const { excd, symb } of res) {
      (async function ({ excd, symb }) {
        const detail: any = await APIS.HHDFS76240000(
          {
            EXCD: excd,
            SYMB: symb,
            GUBN: '0',
            name: '-',
          } as any,
          1,
        ).then((e: any) => (e.data.dataList ? e.data.dataList[0] : null));
        if (detail === null) {
          console.log(excd, symb, '종목가격정보 조회 실패');
          return;
        }

        // const OVERSEA_CONTINUOUS_INFO = await exeQuery(
        //   `select updown,continuous,stckClpr,basedate
        //      from OVERSEA_CONTINUOUS_INFO
        //     where excd = '${excd}'
        //       and symb = '${symb}';`,
        // );
        // console.log(OVERSEA_CONTINUOUS_INFO);

        exeQuery(`
          INSERT INTO OVERSEA_CONTINUOUS_INFO(excd,symb,updown,continuous,stckClpr,basedate)
          VALUES ('${excd}','${symb}',${
          parseFloat(detail.rate) > 0
            ? "'U'"
            : parseFloat(detail.rate) < 0
            ? "'D'"
            : 'null'
        }, -1, ${
          Number.isNaN(parseInt(detail.clos)) ? 'null' : detail.clos
        }, '${detail.xymd}');
        `).catch((e) => {
          console.log(e);
          console.log(`
          INSERT INTO OVERSEA_CONTINUOUS_INFO(excd,symb,updown,continuous,stckClpr,basedate)
          VALUES ('${excd}','${symb}',${
            parseFloat(detail.rate) > 0
              ? "'U'"
              : parseFloat(detail.rate) < 0
              ? "'D'"
              : 'null'
          }, -1, ${detail.clos}, '${detail.xymd}');
          `);
        });
      })({ excd, symb });
    }
  }
}
