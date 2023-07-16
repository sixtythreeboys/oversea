import { APIS } from './KIS.apis';
import { ITEM_MAST } from 'src/MongoDB/Model/MongoDB.ITEM_MAST';
import { HHDFS76200200 } from 'src/MongoDB/Model/MongoDB.HHDFS76200200';

export const LoopCallback = [
  async (recv) => {
    recv = recv.data;
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
      console.log(result);
    } catch (error) {
      console.log('Error occurred:', error);
    }
  },
];

export async function init() {
  const ItemList = await ITEM_MAST.find().then((e) =>
    e.map(({ excd, symb }: any) => {
      return { excd, symb };
    }),
  );
  async function Loop(excd, symb) {
    try {
      const recv = await APIS.HHDFS76200200({
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
