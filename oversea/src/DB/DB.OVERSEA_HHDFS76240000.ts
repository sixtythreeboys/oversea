import { dbModel } from './DB.model';
import { exeQuery } from './DB.service';
import { writeFileSync } from 'fs';

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

export async function mergeList(
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
      .join(', ')}
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
    writeFileSync('output', sql, 'utf8');
    const res = await exeQuery(sql)
      .then((e) => {
        return true;
      })
      .catch((e) => {
        return false;
      });

    return res;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
  }
}
