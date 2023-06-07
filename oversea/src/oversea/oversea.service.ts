import { Injectable } from '@nestjs/common';
import { HHDFS76410000 } from './oversea.type';
import { Markets } from './oversea.type';
import { APIS } from '../KIS/KISAPIS';
import { getItemByKey, getItemList } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { getDataByOption } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { getDataByDateList } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { generateDateList, getToday } from 'src/common/util/dateUtils';

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
  async getList(params: HHDFS76410000) {
    let results = await Promise.all(
      ['NAS'].map((market) => {
        return APIS.HHDFS76410000(
          Object.assign({ EXCD: market } as HHDFS76410000, params),
        );
      }),
    );
    results = results.reduce((a, c) => a.concat(c));
    return {
      status: 200,
      data: results,
    };
  }
  async list_v1(period: number, avlsScal: number) {
    try {
      const list: any = await this.getList({} as any);
      const filteredItems = list.data.filter((e) => {
        const rate = parseFloat(e.rate);
        if (rate === 0.0) return false;
        //true
        else {
          if (period > 0 && rate > 0) return true;
          else if (period < 0 && rate < 0) return true;
          else return false;
        }
      });
      const promises = filteredItems.map(async (item) => {
        const response: any = await APIS.HHDFS76240000(
          {
            EXCD: item.excd,
            SYMB: item.symb,
          } as any,
          period,
        );
        response.data = Object.assign(
          { name: item.name, excd: item.excd, symb: item.symb },
          response.data,
        );
        return response;
      });
      const values = await Promise.all(promises);
      const res = values
        .map((e) => e.data)
        .filter((e) => {
          e = e.dataList.map((e) => parseFloat(e.rate));
          for (const rate of e) {
            if (period > 0 && rate < 0) {
              return false;
            } else if (period < 0 && rate > 0) {
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
      return { status: 500, data: error };
    }
  }

  async list_v2(period: number, avlsScal: number) {
    let itemList = (await getDataByOption(period, avlsScal)) as {
      excd;
      symb;
    }[];
    itemList = (await Promise.all(
      itemList.map(async (item) => {
        let details = await APIS.HHDFS76240000(
          {
            EXCD: item.excd,
            SYMB: item.symb,
            GUBN: '0',
          } as any,
          period,
        );
        return { excd: item.excd, symb: item.symb, details };
      }),
    )) as [];
    itemList = (await Promise.all(
      itemList.map(async (item: { excd; symb; details }) => {
        const last = item.details[0];
        const name = await getItemByKey(item.excd, item.symb).then((e) =>
          e ? e.knam : '-',
        );
        const res = {
          excd: item.excd,
          mkscShrnIscd: item.symb,
          htsKorIsnm: name,
          stckClpr: parseFloat(last.clos),
          prdyAvlsScal: 'string',
          prdyCtrt: parseFloat(last.rate),
          totalCtrt: item.details.reduce((a, c) => a + parseFloat(c.rate), 0),
        };
        return res;
      }),
    )) as [];

    return { status: 200, data: itemList };
  }
  async list_v3(period: number, avlsScal: number) {
    let itemList = (await getDataByOption(period, avlsScal)) as {
      excd;
      symb;
    }[];
    itemList = (await Promise.all(
      itemList.map(async (item) => {
        const details = await getDataByDateList(
          item.excd,
          item.symb,
          generateDateList(getToday(), period),
        );
        console.log(details);
        return { excd: item.excd, symb: item.symb, details };
      }),
    )) as [];
    itemList = (await Promise.all(
      itemList.map(async (item: { excd; symb; details }) => {
        const last = item.details[0];
        const name = await getItemByKey(item.excd, item.symb).then((e) =>
          e ? e.knam : '-',
        );
        const res = {
          excd: item.excd,
          mkscShrnIscd: item.symb,
          htsKorIsnm: name,
          stckClpr: parseFloat(last.clos),
          prdyAvlsScal: 'string',
          prdyCtrt: parseFloat(last.rate),
          totalCtrt: item.details.reduce((a, c) => a + parseFloat(c.rate), 0),
        };
        return res;
      }),
    )) as [];

    return { status: 200, data: itemList };
  }
  async getDetail_v1({ EXCD, 종목코드, 기간분류코드, period }) {
    const datas = await APIS.HHDFS76240000(
      {
        EXCD: EXCD,
        SYMB: 종목코드,
        GUBN: {
          D: '0',
          W: '1',
          M: '2',
        }[기간분류코드],
        name: '-',
      } as any,
      period,
    );
    return {
      status: 200,
      data: datas.map(
        ({
          xymd,
          clos,
          sign,
          diff,
          rate,
          open,
          high,
          low,
          tvol,
          tamt,
          pbid,
          vbid,
          pask,
          vask,
        }) => {
          return {
            stckBsopDate: xymd,
            stckClpr: clos,
            prdyVrssSign: sign,
            prdyVrss: diff,
            rate,
            stckOprc: open,
            stckHgpr: high,
            stckLwpr: low,
            acmlVol: tvol,
            acmlTrPbmn: tamt,
            pbid,
            vbid,
            pask,
            vask,
          };
        },
      ),
    };
  }
  async getDetail_v2({ EXCD, 종목코드, 기간분류코드, period }) {}
}
