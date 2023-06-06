import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { APIS } from 'src/KIS/KISAPIS';
import { updateToken } from '../oversea.middleware';
import { mergeList as OVERSEA_HHDFS76240000_merge } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { mergeList as TRADING_MARKETS_OPEN_DATE_merge } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import {
  mergeList as OVERSEA_CONTINUOUS_INFO_merge,
  getLastDay,
} from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { dbModel } from 'src/DB/DB.model';
import { getItemList } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { getToday } from 'src/common/util/dateUtils';

import { writeFileSync, appendFileSync } from 'fs';

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
    //   this.updateTradingDate(getToday());
    // });
    // this.job.start();

    this.updateUpDown(getToday());
    //this.updateTradingDate(getToday());
  }
  async updateTradingDate(basedate) {
    const recvData = await APIS.CTOS5011R({ TRAD_DT: basedate });
    if (await TRADING_MARKETS_OPEN_DATE_merge(recvData.data)) {
      console.log(
        `${recvData.data.length} items inserted into TRADING_MARKETS_OPEN_DATE.`,
      );
      dbModel.connection.commit();
    } else {
      console.log('insert failed');
    }
  }
  async updateUpDown(basedate) {
    const lastday = await getLastDay();
    console.log(lastday);
  }
  async updateDetailInfo(basedate) {
    let dataList: any[] = await getItemList();
    dataList = await Promise.all(
      dataList.map(async ({ excd, symb }) => {
        const detail: any = await APIS.HHDFS76240000(
          {
            EXCD: excd,
            SYMB: symb,
            GUBN: '0',
            BYMD: basedate,
          } as any,
          1,
        )
          .then((detail: any) => (detail.length > 0 ? detail[0] : null))
          .catch((e) => {
            console.log(e);
            return null;
          });
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

    if (await OVERSEA_HHDFS76240000_merge(dataList)) {
      console.log(
        `${dataList.length} items inserted into OVERSEA_HHDFS76240000.`,
      );
      dbModel.connection.commit();
    } else {
      console.log('insert failed');
    }
  }
}
