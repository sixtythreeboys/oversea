import { Injectable } from '@nestjs/common';
import { CONTINUOUS_INFO } from 'src/MongoDB/Model/MongoDB.CONTINUOUS_INFO';
import { ITEM_MAST } from 'src/MongoDB/Model/MongoDB.ITEM_MAST';
import { KISApiService } from 'src/KIS/KIS.API.service';
import config from 'config';
import { getDatestring } from 'src/common/util/dateUtils';
import KISModel from 'src/KIS/KIS.model';

@Injectable()
export class BatchUpdateContinuous {
  BASEDATE: Date | null;
  constructor(private readonly apiService: KISApiService) {
    this.BASEDATE = null;
  }

  async makeNew({ excd, symb }) {
    function getContinueData(DataList): [number, any[]] {
      const res = [];
      let dir = 0;
      for (const data of DataList) {
        for (const key of Object.keys(data)) {
          if (!['xymd', 'sign'].includes(key)) {
            data[key] = parseFloat(data[key]);
          }
        }
        if (Object.values(data).includes(Number.NaN)) return [null, null];

        res.push(data);
        if (dir === -1 && data.rate > 0) {
          break;
        } else if (dir === 1 && data.rate < 0) {
          break;
        }
        if (dir === 0 && data.rate !== 0) {
          dir = data.rate > 0 ? 1 : -1;
        }
      }
      let last = 0;
      for (const idx in res) {
        if (res[idx].rate * dir > 0) last = parseInt(idx);
      }
      return [dir, res.slice(0, last + 1)];
    }
    let DataList = null;
    let dir = 0;
    for (
      let buffer = config.Batch.BufferSize;
      ;
      buffer += config.Batch.BufferSize
    ) {
      DataList = await this.apiService
        .HHDFS76240000(
          {
            EXCD: excd,
            SYMB: symb,
            GUBN: '0',
            BYMD: getDatestring(this.BASEDATE),
          } as any,
          buffer,
        )
        .catch((e) => {
          //console.log(e);
          return null;
        });
      if (DataList === null) return;
      [dir, DataList] = getContinueData(DataList);
      if (DataList === null) return;
      if (DataList.length < buffer) break;
    }
    const htsKorIsnm = KISModel.knamMap[`D${excd}${symb}`];

    const insertData = new CONTINUOUS_INFO({
      excd: excd,
      symb: symb,
      continuous: DataList.length * dir,
      datas: DataList,
      htsKorIsnm: htsKorIsnm,
      cdate: new Date(),
    });
    try {
      insertData.save();
    } catch (e) {
      console.log('insertFailed');
      console.log(insertData);
    }
  }

  async updateContinuous(BASEDATE: Date) {
    this.BASEDATE = BASEDATE;
    const ItemList = await ITEM_MAST.find().then((e) =>
      e.map(({ excd, symb }: any) => {
        return { excd, symb };
      }),
    );
    await CONTINUOUS_INFO.deleteMany({});
    for (const { excd, symb } of ItemList) {
      try {
        this.makeNew({ excd, symb });
      } catch (e) {
        //console.log(e);
      }
    }
  }
}
