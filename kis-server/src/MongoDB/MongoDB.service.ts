import { ITEM_MAST } from './Model/MongoDB.ITEM_MAST';
import { dbModel } from './MongoDB.model';
import CONFIG from 'config';
import KISModel from 'src/KIS/KIS.model';

export async function init() {
  await dbModel.connection
    .connect(CONFIG.MongoDB.connectString)
    .then(() => console.log('Mongoose Connected'));
  KISModel.knamMap = await ITEM_MAST.find().then((dataList) =>
    Object.fromEntries(dataList.map((e) => [`D${e.excd}${e.symb}`, e.knam])),
  );
  return;
}
