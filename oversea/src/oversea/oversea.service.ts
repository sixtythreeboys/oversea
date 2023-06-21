import { Injectable } from '@nestjs/common';
import { APIS } from '../KIS/KISAPIS';
import { services as OVERSEA_CONTINUOUS_INFO } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { services as OVERSEA_ITEM_MAST } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { getToday } from 'src/common/util/dateUtils';

@Injectable()
export class OverseaService {
  async list({ period, avlsScal }) {
    let itemList = null;
    [period, avlsScal] = [parseInt(period), parseFloat(avlsScal)];
    itemList = await OVERSEA_CONTINUOUS_INFO.getDataByOption({
      period,
      avlsScal,
    });
    itemList = itemList.map((item) => {
      return {
        excd: item.excd,
        mkscShrnIscd: item.symb,
        htsKorIsnm: item.htsKorIsnm,
        stckClpr: item.stckClpr,
        prdyAvlsScal: '-',
        prdyCtrt: item.prdyCtrt,
        totalCtrt: item.totalCtrt,
      };
    });
    itemList.sort((a, b) => a.stckClpr > b.stckClpr);
    return itemList;
  }

  async getDetail({ EXCD, 종목코드, 기간분류코드, period }) {
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
    return datas.map(
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
    );
  }
}
