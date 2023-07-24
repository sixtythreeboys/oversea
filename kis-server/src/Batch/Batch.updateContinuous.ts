import { Injectable } from '@nestjs/common';
import { CONTINUOUS_INFO } from 'src/MongoDB/Model/MongoDB.CONTINUOUS_INFO';
import { ITEM_MAST } from 'src/MongoDB/Model/MongoDB.ITEM_MAST';
import { KISApiService } from 'src/KIS/KIS.API.service';
import config from 'config';

@Injectable()
export class BatchUpdateContinuous {
  BASEDATE: Date | null;
  constructor(private readonly apiService: KISApiService) {
    this.BASEDATE = null;
  }

  async makeNew({ excd, symb }) {
    for (
      let buffer = config.Batch.BufferSize;
      buffer === config.Batch.BufferSize;
      buffer += config.Batch.BufferSize
    ) {
      const DataList = await this.apiService.HHDFS76240000(
        {
          EXCD: excd,
          SYMB: symb,
          GUBN: '0',
          BYMD: this.BASEDATE,
        } as any,
        buffer,
      );
      //console.log(DataList);
    }
  }
  async updateExist() {}

  async updateContinuous(BASEDATE: Date) {
    this.BASEDATE = BASEDATE;
    const ItemList = await ITEM_MAST.find().then((e) =>
      e.map(({ excd, symb }: any) => {
        return { excd, symb };
      }),
    );
    for (const { excd, symb } of ItemList.slice(0, 1)) {
      const Continuous = await CONTINUOUS_INFO.find({ excd, symb });
      if (Continuous.length === 0) {
        this.makeNew({ excd, symb });
      }
    }
  }
}
