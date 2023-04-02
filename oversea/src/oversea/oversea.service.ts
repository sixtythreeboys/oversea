import { Injectable } from '@nestjs/common';
import { HHDFS76410000 } from './oversea.type';
import { Markets } from './oversea.type';
import { enqueue } from 'src/common/util/delayingQueue';
import { APIS } from './KISAPIS';
import { resolve } from 'path';

export const markets: Markets[] = [
  'NYS',
  'NAS',
  'AMS',
  'TSE',
  'HKS',
  'SHS',
  'SZS',
  'HSX',
  'HNX',
];

@Injectable()
export class OverseaService {
  async revokeP() {}
  async getList(params: HHDFS76410000) {
    return new Promise(
      function (resolve, reject) {
        Promise.all(
          ['NAS'].map((market) => {
            return APIS.HHDFS76410000(
              Object.assign({ EXCD: market } as HHDFS76410000, params),
            );
          }),
        )
          .then((results) => {
            results = results
              .map(({ status, data }: any) => data)
              .reduce((a, c) => a.concat(c));
            resolve({ status: 200, data: results });
          })
          .catch((e) => {
            const { status, data } = e.response;
            reject({ status, data });
          });
      }.bind(this),
    );
  }
  async service1_1(period: number, gradient: '1' | '-1') {
    try {
      const list: any = await this.getList({} as any);
      const filteredItems = list.data.filter((e) => {
        const rate = parseFloat(e.rate);
        if (rate === 0.0) return false; //true
        else {
          if (gradient === '1' && rate > 0) return true;
          else if (gradient === '-1' && rate < 0) return true;
          else return false;
        }
      });
      const promises = filteredItems.map((item) => {
        return enqueue(async () => {
          const response: any = await APIS.HHDFS76240000(
            {
              EXCD: item.excd,
              SYMB: item.symb,
              name: '-',
            } as any,
            period,
          );
          response.data = Object.assign(
            { name: item.name, excd: item.excd, symb: item.symb },
            response.data,
          );
          return response;
        });
      });
      const values = await Promise.all(promises);
      const res = values
        .map((e) => e.data)
        .filter((e) => {
          e = e.dataList.map((e) => parseFloat(e.rate));
          for (const rate of e) {
            if (gradient === '1' && rate < 0) {
              return false;
            } else if (gradient === '-1' && rate > 0) {
              return false;
            }
          }
          return true;
        })
        .map((e) => {
          const last = e.dataList[0];
          const res = {
            excd: e.excd,
            mkscShrnIscd: e.symb,
            htsKorIsnm: e.name,
            stckClpr: parseFloat(last.clos),
            prdyAvlsScal: 'string',
            prdyCtrt: parseFloat(last.rate),
            totalCtrt: e.dataList.reduce((a, c) => a + parseFloat(c.rate), 0),
          };
          return res;
        });
      return { status: 200, data: res };
    } catch (error) {
      return { status: 200, data: error };
    }
  }
}
