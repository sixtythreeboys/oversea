import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/KISserver/KISserver.apis';
import { HHDFS76200200 } from 'src/MongoDB/Model/MongoDB.HHDFS76200200';
import { CONTINUOUS_INFO } from 'src/MongoDB/Model/MongoDB.CONTINUOUS_INFO';

@Injectable()
export class OverseaService {
  constructor(private readonly apiService: ApiService) {}
  async list({ period, avlsScal }) {
    const continuous_Data = await CONTINUOUS_INFO.find(
      period > 0
        ? { continuous: { $gt: period } }
        : period < 0
        ? { continuous: { $lt: period } }
        : {},
    );
    const HHDFS76200200_Data = await HHDFS76200200.find(
      avlsScal > 0
        ? { tomv: { $gt: Math.abs(avlsScal) } }
        : avlsScal < 0
        ? { tomv: { $lt: Math.abs(avlsScal) } }
        : {},
    );
    let results = [];
    if (period === 0) {
      for (const data of HHDFS76200200_Data) {
        results.push([data.tomv, data]);
      }
    } else {
      const HHDFS76200200_Map = Object.fromEntries(
        HHDFS76200200_Data.map((e) => [e.rsym, e]),
      );
      for (const data of continuous_Data) {
        const key = `D${data.excd}${data.symb}`;
        if (HHDFS76200200_Map[key] !== undefined) {
          results.push([HHDFS76200200_Map[key].tomv, data]);
        }
      }
    }
    results.sort((a, b) => b[0] - a[0]);
    results = results
      .map(([tomv, data]: any) => {
        try {
          let totalCtrt = 0;
          for (let i = 0; i < Math.abs(period); i++) {
            totalCtrt = data.datas[i].rate;
          }
          return {
            tomv: tomv,
            excd: data.excd,
            mkscShrnIscd: data.symb,
            htsKorIsnm: data.htsKorIsnm,
            stckClpr: data.datas[0].clos,
            prdyAvlsScal: '-',
            prdyCtrt: data.datas[0].rate,
            totalCtrt: totalCtrt,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      })
      .filter((e) => e);
    return results;
  }

  async getDetail({ EXCD, 종목코드, 기간분류코드, period }) {
    const datas = await this.apiService.getDetail(
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
