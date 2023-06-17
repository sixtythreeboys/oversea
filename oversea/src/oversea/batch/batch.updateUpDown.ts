import { services as OVERSEA_ITEM_MAST } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { services as OVERSEA_CONTINUOUS_INFO } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { APIS } from 'src/KIS/KISAPIS';
import { dbModel } from 'src/DB/DB.model';

export async function updateUpDown(basedate) {
  let itemList: any[] = await OVERSEA_ITEM_MAST.getItemList();
  const updateData = [];
  itemList = await Promise.all(
    itemList.map(async (item) => {
      const [continuousData, recvData] = await Promise.all([
        OVERSEA_CONTINUOUS_INFO.getData(item.excd, item.symb),
        APIS.HHDFS76240000(
          {
            EXCD: item.excd,
            SYMB: item.symb,
            GUBN: '0',
            BYMD: basedate,
          } as any,
          1,
        )
          .then((detail: any) => (detail.length > 0 ? detail[0] : null))
          .catch((e) => {
            console.log(e);
            return null;
          }),
      ]);
      if (recvData === null) {
        return null;
      }
      if (continuousData.updown === 'D') {
        if (parseFloat(recvData.rate) >= 0) {
          continuousData.continuous =
            continuousData.continuous > 0 ? continuousData.continuous + 1 : 1;
        } else if (parseFloat(recvData.rate) < 0) {
          continuousData.continuous = 1;
          continuousData.updown = 'U';
        }
      } else if (continuousData.updown === 'U') {
        if (parseFloat(recvData.rate) <= 0) {
          continuousData.continuous =
            continuousData.continuous > 0 ? continuousData.continuous + 1 : 1;
        } else if (parseFloat(recvData.rate) > 0) {
          continuousData.continuous = 1;
          continuousData.updown = 'D';
        }
      }
      continuousData.stckClpr = recvData.clos;
      continuousData.basedate = basedate;
      console.log(item.symb);
      return continuousData;
    }),
  );
  itemList = itemList.filter((e) => e);
  if (await OVERSEA_CONTINUOUS_INFO.mergeList(itemList)) {
    console.log(
      `${itemList.length} items inserted into OVERSEA_CONTINUOUS_INFO.`,
    );
    dbModel.connection.commit();
  } else {
    console.log('insert failed');
  }
}
