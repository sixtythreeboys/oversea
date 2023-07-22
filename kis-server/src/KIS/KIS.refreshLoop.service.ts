import { Injectable } from '@nestjs/common';
import { ITEM_MAST } from 'src/MongoDB/Model/MongoDB.ITEM_MAST';
import { HHDFS76200200 } from 'src/MongoDB/Model/MongoDB.HHDFS76200200';
import { APIService } from 'src/KIS/KIS.API.service'; // Adjust the path to your APIService file

export const LoopCallback = new Set([
  async (recv) => {
    recv = recv.data;
    recv.updatedTime = new Date();
    if (!recv.rsym) return;
    try {
      const filter = { rsym: recv.rsym }; // Properties to check for duplication
      const update = recv;
      const options = { upsert: true, new: true }; // Create a new document if not found
      const result = await HHDFS76200200.findOneAndUpdate(
        filter,
        update,
        options,
      );
      //console.log(result);
    } catch (error) {
      console.log('Error occurred:', error);
    }
  },
]);

@Injectable()
export class LoopService {
  constructor(private readonly apiService: APIService) {
    this.init().then((e) => {
      console.log('KIS.refreshLoop inited');
    });
  }

  async init() {
    const ItemList = await ITEM_MAST.find().then((e) =>
      e.map(({ excd, symb }: any) => {
        return { excd, symb };
      }),
    );
    const HHDFS76200200: any = this.apiService.HHDFS76200200;
    async function Loop(excd, symb) {
      try {
        const recv = await HHDFS76200200({
          EXCD: excd,
          SYMB: symb,
        });
        for (const callback of LoopCallback) {
          callback(recv);
        }
      } catch (err) {
        console.log(err);
      } finally {
        Loop(excd, symb);
      }
    }

    for (const { excd, symb } of ItemList) {
      Loop(excd, symb);
    }
    //   console.log(temp);
  }
}