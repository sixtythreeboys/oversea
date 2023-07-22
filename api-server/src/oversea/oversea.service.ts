import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/KISserver/KISserver.apis';

@Injectable()
export class OverseaService {
  constructor(private readonly apiService: ApiService) {}
  async list({ period, avlsScal }) {}

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
