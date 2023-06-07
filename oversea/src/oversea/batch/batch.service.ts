import { Inject, Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { OverseaService } from 'src/oversea/oversea.service';
import { APIS } from 'src/KIS/KISAPIS';
import { updateToken } from '../oversea.middleware';
import {
  mergeList2 as OVERSEA_HHDFS76240000_merge,
  getLastDay as OVERSEA_HHDFS76240000_getLastDay,
} from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { mergeList as TRADING_MARKETS_OPEN_DATE_merge } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import {
  mergeList as OVERSEA_CONTINUOUS_INFO_merge,
  getData,
  getLastDay as OVERSEA_CONTINUOUS_INFO_getLastDay,
} from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { dbModel } from 'src/DB/DB.model';
import { getItemList } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import {
  addOneDay,
  getDateDiff,
  getDateList,
  getToday,
} from 'src/common/util/dateUtils';

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
    this.job = new CronJob('0 0 1 * * *', async () => {
      (async function () {
        const dateList = getDateList(
          await OVERSEA_CONTINUOUS_INFO_getLastDay(),
          getToday(),
        );
        for (const date of dateList) {
          this.updateUpDown(date).catch((e) => console.log(e));
        }
      })();
      (async function () {
        const dateList = getDateList(
          await OVERSEA_HHDFS76240000_getLastDay(),
          getToday(),
        );
        for (const date of dateList) {
          this.updateDetailInfo(date).catch((e) => console.log(e));
        }
      });
      this.updateTradingDate(getToday()).catch((e) => console.log(e));
    });
    this.job.start();

    this.temp(getToday())
      .then((e) => console.log('ended'))
      .catch((e) => console.log(e));
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
    const itemList: any[] = await getItemList();
    const updateData = [];
    for (const item of itemList) {
      const [continuousData, recvData] = await Promise.all([
        getData(item.excd, item.symb),
        APIS.HHDFS76240000(
          {
            EXCD: item.excd,
            SYMB: item.symb,
            GUBN: '0',
            BYMD: basedate,
          } as any,
          1,
        )
          .then((detail: any) => (detail.length > 0 ? detail[0] : null))
          .catch((e) => {
            console.log(e);
            return null;
          }),
      ]);
      if (recvData === null) {
        return;
      }
      if (continuousData.updown === 'D') {
        if (parseFloat(recvData.rate) >= 0) {
          continuousData.continuous =
            continuousData.continuous > 0 ? continuousData.continuous + 1 : 1;
        } else if (parseFloat(recvData.rate) < 0) {
          continuousData.continuous = 1;
          continuousData.updown = 'U';
        }
      } else if (continuousData.updown === 'U') {
        if (parseFloat(recvData.rate) <= 0) {
          continuousData.continuous =
            continuousData.continuous > 0 ? continuousData.continuous + 1 : 1;
        } else if (parseFloat(recvData.rate) > 0) {
          continuousData.continuous = 1;
          continuousData.updown = 'D';
        }
      }
      continuousData.stckClpr = recvData.clos;
      continuousData.basedate = basedate;
      updateData.push(continuousData);
    }
    if (await OVERSEA_CONTINUOUS_INFO_merge(updateData)) {
      console.log(
        `${updateData.length} items inserted into OVERSEA_CONTINUOUS_INFO.`,
      );
      dbModel.connection.commit();
    } else {
      console.log('insert failed');
    }
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
  async temp(basedate) {
    let dataList: any[] = await getItemList();
    dataList = await Promise.all(
      dataList.slice(0, 2).map(async ({ excd, symb }) => {
        const detail: any = await APIS.HHDFS76240000(
          {
            EXCD: excd,
            SYMB: symb,
            GUBN: '0',
            BYMD: basedate,
          } as any,
          10,
        )
          .then((detail: any) => (detail.length > 0 ? detail : null))
          .catch((e) => {
            console.log(e);
            return null;
          });
        if (detail === null) {
          console.log(excd, symb, '종목가격정보 조회 실패');
          return null;
        }
        return detail.map((e) => {
          e.excd = excd;
          e.symb = symb;
          return e;
        });
      }),
    ).then((dataList) => dataList.filter((e) => e));
    for (const data of dataList) {
      if (await OVERSEA_HHDFS76240000_merge(data)) {
        console.log(
          `${data[0].excd} ${data[0].symb} ${data.length} items inserted into OVERSEA_HHDFS76240000.`,
        );
        dbModel.connection.commit();
      } else {
        console.log('insert failed');
      }
    }
  }
}
