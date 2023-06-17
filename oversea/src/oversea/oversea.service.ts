import { Injectable } from '@nestjs/common';
import { APIS } from '../KIS/KISAPIS';
import { services as OVERSEA_CONTINUOUS_INFO } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';

@Injectable()
export class OverseaService {
  async list({ period, avlsScal }) {
    if (period === 0) {
      throw new Error('연속기간의 크기는 0이 될 수 없습니다.');
    }
    let data = null;
    data = await OVERSEA_CONTINUOUS_INFO.getDataByOption({
      period: parseInt(period),
      avlsScal: parseFloat(avlsScal),
    });

    return true;
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
