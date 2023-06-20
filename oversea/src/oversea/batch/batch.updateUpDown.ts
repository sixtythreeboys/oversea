import { services as OVERSEA_ITEM_MAST } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { services as OVERSEA_CONTINUOUS_INFO } from 'src/DB/DB.OVERSEA_CONTINUOUS_INFO';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { getDateList } from 'src/common/util/dateUtils';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { dbModel } from 'src/DB/DB.model';
import { exeQuery } from 'src/DB/DB.service';

export async function updateByRow({ excd, symb, xymd, clos, rate }) {
  rate = parseFloat(rate);
  const ContiData = await OVERSEA_CONTINUOUS_INFO.getData(excd, symb);
  const lastData = ContiData[0];
  if (lastData.xymd === xymd) return false;

  if (lastData.prdyCtrt * rate < 0) {
    lastData.continuous = 0;
    lastData.totalCtrt = 0;
    await OVERSEA_CONTINUOUS_INFO.deleteData(excd, symb);
    await OVERSEA_CONTINUOUS_INFO.mergeList([
      lastData,
      {
        excd: excd,
        symb: symb,
        continuous: lastData.continuous + (rate > 0 ? 1 : -1),
        stckClpr: clos,
        prdyAvlsScal: null,
        prdyCtrt: rate,
        totalCtrt: lastData.totalCtrt + rate,
        htsKorIsnm: null,
        xymd: xymd,
      },
    ]);
    console.log(`updateByRow : ${excd} ${symb} ${xymd} swapped`);
  } else {
    await OVERSEA_CONTINUOUS_INFO.mergeList([
      {
        excd: excd,
        symb: symb,
        continuous: lastData.continuous + (lastData.continuous > 0 ? 1 : -1),
        stckClpr: clos,
        prdyAvlsScal: null,
        prdyCtrt: rate,
        totalCtrt: lastData.totalCtrt + rate,
        htsKorIsnm: null,
        xymd: xymd,
      },
    ]);
    console.log(`updateByRow : ${excd} ${symb} ${xymd} added`);
  }
  return true;
}
export async function fillEmpty_NAS(today) {
  console.log(`updateUpDown started : ${today}`);
  const dateList = await TRADING_MARKETS_OPEN_DATE.getNasOpenList(
    await OVERSEA_CONTINUOUS_INFO.getLastDay(),
  );
  let itemList = await OVERSEA_HHDFS76240000.getDataByDateList(dateList);

  await Promise.all(itemList.map((row) => updateByRow(row)));
  return true;
}
