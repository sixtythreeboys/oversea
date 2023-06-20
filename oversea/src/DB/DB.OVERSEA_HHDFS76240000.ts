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

export const services = {
  async getDataByDateList(DateList) {
    DateList.sort();
    if (DateList.length === 0) return null;
    try {
      const sql = `
          select excd,symb,xymd,clos,sign,diff,rate,\`open\` as open, high,low,tvol,tamt,pbid,vbid,pask,vask
            from OVERSEA_HHDFS76240000
           where xymd BETWEEN '${DateList[0]}' and '${
        DateList[DateList.length - 1]
      }'
           order by xymd asc;
        `;
      const dbres = (await exeQuery(sql).catch((e) => {
        console.log(`'getDataByDateList failed`);
      })) as any[];

      return dbres;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async getDataByDateList_V2(DateList) {
    DateList.sort();
    if (DateList.length === 0) return null;
    try {
      const dataList = Object.fromEntries(DateList.map((date) => [date, null]));

      const dbres = this.getDataByDateList(DateList);

      for (const row of dbres) {
        let table = dataList;
        if (table[row.xymd] === null) {
          table[row.xymd] = {};
        }
        table = table[row.xymd];
        if (table[row.excd] === undefined) {
          table[row.excd] = {};
        }
        table = table[row.excd];
        table[row.symb] = row;
      }
      return dataList;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async getLastDay() {
    const sql = `
          SELECT MAX(xymd) as lastD
            FROM OVERSEA_HHDFS76240000;
        `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    return lastday[0] ? lastday[0].lastD : null;
  },
  async mergeList(itemList: OVERSEA_HHDFS76240000[]): Promise<boolean> {
    for (const item of itemList) {
      const sql = `
        INSERT INTO OVERSEA_HHDFS76240000
          (excd, symb, xymd, clos, sign, diff, rate, \`open\`, high, low, tvol, tamt, pbid, vbid, pask, vask)
          VALUES
          ('${item.excd}', '${item.symb}', '${item.xymd}', ${
        item.clos ?? 'null'
      }, '${item.sign ?? 'null'}', ${item.diff ?? 'null'}, '${
        item.rate ?? 'null'
      }',
           ${item.open ?? 'null'}, ${item.high ?? 'null'}, ${
        item.low ?? 'null'
      }, ${item.tvol ?? 'null'}, ${item.tamt ?? 'null'},
           ${item.pbid ?? 'null'}, ${item.vbid ?? 'null'}, ${
        item.pask ?? 'null'
      }, ${item.vask ?? 'null'})
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
  },
};
