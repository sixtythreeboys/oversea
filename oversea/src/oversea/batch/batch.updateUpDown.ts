import { services as OVERSEA_ITEM_MAST } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { services as OVERSEA_CONTINUOUS_INFO } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { getDateList } from 'src/common/util/dateUtils';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { dbModel } from 'src/DB/DB.model';

async function updateUpDown(excd, symb, detailDatas, basedate) {
  const continuousData: any = await OVERSEA_CONTINUOUS_INFO.getData(excd, symb);
  
  if (continuousData === null) return null;

  for (const detail of detailDatas) {
    detail.rate = parseFloat(detail.rate);
    if (continuousData.continuous > 0) {
      if (detail.rate >= 0) {
        continuousData.continuous += 1;
      } else {
        continuousData.continuous = 1;
      }
    } else if (continuousData.continuous < 0) {
      if (detail.rate <= 0) {
        continuousData.continuous -= 1;
      } else {
        continuousData.continuous = 1;
      }
    } else {
      continuousData.continuous =
        detail.rate === 0 ? 0 : detail.rate < 0 ? -1 : 1;
    }
    continuousData.stckClpr = detail.clos;
    console.log(continuousData);
  }
  continuousData.basedate = basedate;
  return continuousData;;
}

export async function fillEmpty_NAS(today) {
  console.log(`updateUpDown started : ${today}`);
  let itemList: any[] = await OVERSEA_ITEM_MAST.getItemList();
  const [ContinuousLastDay, DetailLastDay] = [
    '20230606',//await OVERSEA_CONTINUOUS_INFO.getLastDay(),
    await OVERSEA_HHDFS76240000.getLastDay(),
  ];
  const dateList = getDateList(ContinuousLastDay, DetailLastDay);
  itemList = await Promise.all(
    itemList.map(async ({ excd, symb }) => {
      let detailDatas = await OVERSEA_HHDFS76240000.getDataByDateList(
        excd,
        symb,
        dateList,
      );
      detailDatas = Object.values(detailDatas).filter((data) => data);
      
      return await updateUpDown(excd, symb, detailDatas, today);
    }),
  );
  itemList = itemList.filter(e=>e);

  // if (await OVERSEA_CONTINUOUS_INFO.mergeList(itemList)) {
  //   console.log(
  //     `${itemList.length} items inserted into OVERSEA_CONTINUOUS_INFO.`,
  //   );
  //   dbModel.connection.commit();
  // } else {
  //   console.log('OVERSEA_CONTINUOUS_INFO insert failed');
  // }

  return true;
}
