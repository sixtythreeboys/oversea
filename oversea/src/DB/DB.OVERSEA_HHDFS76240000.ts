import { getToday } from 'src/common/util/dateUtils';
import { dbModel } from './DB.model';
import { exeQuery } from './DB.service';

export class OVERSEA_HHDFS76240000 {
  excd: string;
  symb: string;
  xymd: string;
  clos?: number | null;
  sign?: string | null;
  diff?: number | null;
  rate?: string | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  tvol?: bigint | null;
  tamt?: bigint | null;
  pbid?: number | null;
  vbid?: bigint | null;
  pask?: number | null;
  vask?: bigint | null;
  constructor(excd, symb, xymd) {
    this.excd = excd;
    this.symb = symb;
    this.xymd = xymd;
  }
}

export async function getDataByDateList(excd, symb, DateList) {
  DateList.sort();
  try {
    const dataList = Object.fromEntries(DateList.map((date) => [date, null]));
    const sql = `
        select excd,symb,xymd,clos,sign,diff,rate,\`open\` as open, high,low,tvol,tamt,pbid,vbid,pask,vask
          from OVERSEA_HHDFS76240000
         where xymd BETWEEN '${DateList[0]}' and '${
      DateList[DateList.length - 1]
    }'
           and excd = '${excd}'
           and symb = '${symb}';
      `;
    const dbres = (await exeQuery(sql).catch((e) => {
      console.log(`'getDataByDateList failed`);
    })) as any[];
    for (const row of dbres) {
      dataList[row.xymd] = row;
    }

    return dataList;
  } catch (e) {
    return null;
  }
}

export async function getLastDay() {
  try {
    const sql = `
        SELECT MAX(basedate) as lastD
          FROM OVERSEA_HHDFS76240000;
      `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    return lastday[0].lastD;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
    return null;
  }
}

export async function mergeList(
  itemList: OVERSEA_HHDFS76240000[],
): Promise<boolean> {
  try {
    for (const item of itemList) {
      const sql = `
      INSERT INTO OVERSEA_HHDFS76240000 (excd, symb, xymd, clos, sign, diff, rate, \`open\`, high, low, tvol, tamt, pbid, vbid, pask, vask)
      VALUES ('${item.excd}', '${item.symb}', '${item.xymd}', ${item.clos}, '${item.sign}', ${item.diff}, '${item.rate}', ${item.open}, ${item.high}, ${item.low}, ${item.tvol}, ${item.tamt}, ${item.pbid}, ${item.vbid}, ${item.pask}, ${item.vask})
      ON DUPLICATE KEY UPDATE
        clos = VALUES(clos),
        sign = VALUES(sign),
        diff = VALUES(diff),
        rate = VALUES(rate),
        \`open\` = VALUES(\`open\`),
        high = VALUES(high),
        low = VALUES(low),
        tvol = VALUES(tvol),
        tamt = VALUES(tamt),
        pbid = VALUES(pbid),
        vbid = VALUES(vbid),
        pask = VALUES(pask),
        vask = VALUES(vask);                
      `;
      await exeQuery(sql).catch((e) => {
        console.log(
          `'${item.excd}', '${item.symb}', '${item.xymd}' insert failed`,
        );
      });
    }

    return true;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
  }
}

export async function mergeList2(
  itemList: OVERSEA_HHDFS76240000[],
): Promise<boolean> {
  try {
    const sql = `
    INSERT INTO OVERSEA_HHDFS76240000 (excd, symb, xymd, clos, sign, diff, rate, \`open\`, high, low, tvol, tamt, pbid, vbid, pask, vask)
    VALUES ${itemList
      .map(
        (item) =>
          `('${item.excd}', '${item.symb}', '${item.xymd}', ${item.clos}, '${item.sign}', ${item.diff}, '${item.rate}', ${item.open}, ${item.high}, ${item.low}, ${item.tvol}, ${item.tamt}, ${item.pbid}, ${item.vbid}, ${item.pask}, ${item.vask})`,
      )
      .join(',')}
    ON DUPLICATE KEY UPDATE
      clos = VALUES(clos),
      sign = VALUES(sign),
      diff = VALUES(diff),
      rate = VALUES(rate),
      \`open\` = VALUES(\`open\`),
      high = VALUES(high),
      low = VALUES(low),
      tvol = VALUES(tvol),
      tamt = VALUES(tamt),
      pbid = VALUES(pbid),
      vbid = VALUES(vbid),
      pask = VALUES(pask),
      vask = VALUES(vask);                
    `;
    console.log(sql);
    await exeQuery(sql).catch((e) => {
      console.log(e);
    });
    return true;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
  }
}
