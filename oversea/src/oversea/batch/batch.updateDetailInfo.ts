import { services as OVERSEA_ITEM_MAST } from 'src/DB/DB.OVERSEA_ITEM_MAST';
import { services as OVERSEA_HHDFS76240000 } from 'src/DB/DB.OVERSEA_HHDFS76240000';
import { services as TRADING_MARKETS_OPEN_DATE } from 'src/DB/DB.TRADING_MARKETS_OPEN_DATE';
import { APIS } from 'src/KIS/KISAPIS';
import { dbModel } from 'src/DB/DB.model';

async function updateDetailInfo(basedate) {
  console.log(`updateDetailInfo started : ${basedate}`);
  let dataList: any[] = await OVERSEA_ITEM_MAST.getItemList();
  dataList = await Promise.all(
    dataList.map(async ({ excd, symb }) => {
      const detail: any = await APIS.HHDFS76240000(
        {
          EXCD: excd,
          SYMB: symb,
          GUBN: '0',
          BYMD: basedate,
        } as any,
        1,
      )
        .then((detail: any) => (detail.length > 0 ? detail[0] : null))
        .catch((e) => {
          console.log(e);
          return null;
        });
      if (detail === null) {
        console.log(excd, symb, '종목가격정보 조회 실패');
        return null;
      } else {
        detail.excd = excd;
        detail.symb = symb;
      }
      return detail;
    }),
  );
  dataList = dataList.filter((e) => e);

  await OVERSEA_HHDFS76240000.mergeList(dataList).then((e) => {
    console.log(
      `${dataList.length} items inserted into OVERSEA_HHDFS76240000 at ${basedate}.`,
    );
    dbModel.connection.commit();
  });
}

export async function fillEmpty(today) {
  const dateList = await TRADING_MARKETS_OPEN_DATE.getNasOpenList(
    await OVERSEA_HHDFS76240000.getLastDay(),
  );
  for (const date of dateList) {
    await updateDetailInfo(date);
  }
  return;
}
