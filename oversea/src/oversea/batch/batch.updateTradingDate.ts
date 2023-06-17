import { APIS } from 'src/KIS/KISAPIS';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { dbModel } from 'src/DB/DB.model';
import { getDateList } from 'src/common/util/dateUtils';
import { writeFileSync } from 'fs';

export async function updateTradingDate(basedate) {
  const recvData = await APIS.CTOS5011R({ TRAD_DT: basedate });
  writeFileSync(
    'src/oversea/batch/' + basedate,
    JSON.stringify(recvData, null, 2),
    'utf8',
  );
  TRADING_MARKETS_OPEN_DATE.mergeList(recvData.data, basedate).then((e) => {
    console.log();
  });
}

export async function fillEmpty(today) {
  const dateList = getDateList(
    '20230608', //await TRADING_MARKETS_OPEN_DATE.getLastDay(),
    today,
  );
  for (const date of dateList) {
    await updateTradingDate(date);
  }
  return;
}
