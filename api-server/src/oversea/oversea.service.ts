import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/KISserver/KISserver.apis';
import { HHDFS76200200 } from 'src/MongoDB/Model/MongoDB.HHDFS76200200';
import { CONTINUOUS_INFO } from 'src/MongoDB/Model/MongoDB.CONTINUOUS_INFO';
import { ITEM_MAST } from 'src/MongoDB/Model/MongoDB.ITEM_MAST';

@Injectable()
export class OverseaService {
  constructor(private readonly apiService: ApiService) {}
  async list({ period, avlsScal }) {
    let results = [];
    const HHDFS76200200_Data = await HHDFS76200200.find(
      avlsScal > 0
        ? { tomv: { $gt: Math.abs(avlsScal) } }
        : avlsScal < 0
        ? { tomv: { $lt: Math.abs(avlsScal) } }
        : {},
    );
    const HHDFS76200200_Map = Object.fromEntries(
      HHDFS76200200_Data.map((e) => [e.rsym, e]),
    );
    if (period === 0) {
      const ITEM_LIST = await ITEM_MAST.find().then((dataList) =>
        Object.fromEntries(
          dataList.map((e) => [`D${e.excd}${e.symb}`, e.knam]),
        ),
      );
      for (const data of HHDFS76200200_Data) {
        const [excd, symb] = [
          data.rsym.substring(1, 4),
          data.rsym.substring(4),
        ];
        const htsKorIsnm = ITEM_LIST[data.rsym];
        results.push({
          tomv: data.tomv,
          excd: excd,
          mkscShrnIscd: symb,
          htsKorIsnm: htsKorIsnm,
          stckClpr: data.base,
          prdyAvlsScal: '-',
          prdyCtrt: 0,
          totalCtrt: 0,
        });
      }
    } else {
      const continuous_Data = await CONTINUOUS_INFO.find(
        period > 0
          ? { continuous: { $gt: period } }
          : period < 0
          ? { continuous: { $lt: period } }
          : {},
      );
      for (const data of continuous_Data) {
        const key = `D${data.excd}${data.symb}`;
        if (HHDFS76200200_Map[key] !== undefined) {
          results.push([HHDFS76200200_Map[key], data]);
        }
      }
      results = results
        .map(([data, conti]: any) => {
          try {
            let totalCtrt = 0;
            for (let i = 0; i < Math.abs(period); i++) {
              totalCtrt = conti.datas[i].rate;
            }
            return {
              tomv: data.tomv,
              excd: conti.excd,
              mkscShrnIscd: conti.symb,
              htsKorIsnm: conti.htsKorIsnm,
              stckClpr: data.base,
              prdyAvlsScal: '-',
              prdyCtrt: conti.datas[0].rate,
              totalCtrt: totalCtrt,
            };
          } catch (e) {
            //console.log(e);
            return null;
          }
        })
        .filter((e) => e);
    }
    results.sort((a, b) => b.tomv - a.tomv);
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
