import { APIS } from 'src/KIS/KISAPIS';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { dbModel } from 'src/DB/DB.model';
import { getDateList } from 'src/common/util/dateUtils';

export async function updateTradingDate(basedate) {
  const recvData = await APIS.CTOS5011R({ TRAD_DT: basedate });
  TRADING_MARKETS_OPEN_DATE.mergeList(recvData.data, basedate).then((e) => {
    console.log(`success : TRADING_MARKETS_OPEN_DATE ( ${basedate} ) updated`);
  }).catch(err=>
    {
      console.log(`failed : TRADING_MARKETS_OPEN_DATE ( ${basedate} ) updated`);
  });
}

export async function fillEmpty(today) {
  const dateList = getDateList(
    await TRADING_MARKETS_OPEN_DATE.getLastDay(),
    today,
  );
  for (const date of dateList) {
    await updateTradingDate(date);
  }
  return;
}
