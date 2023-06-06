import { dbModel } from './DB.model';
import { exeQuery } from './DB.service';

export class OVERSEA_CONTINUOUS_INFO {
  excd: string;
  symb: string;
  updown?: string | null;
  continuous?: number | null;
  stckClpr?: number | null;
  basedate?: string | null;

  constructor(excd: string, symb: string) {
    this.excd = excd;
    this.symb = symb;
  }
}

export async function mergeList(
  itemList: OVERSEA_CONTINUOUS_INFO[],
): Promise<boolean> {
  try {
    for (const item of itemList) {
      const sql = `
        INSERT INTO OVERSEA_CONTINUOUS_INFO (excd, symb, updown, continuous, stckClpr, basedate)
        VALUES ('${item.excd}', '${item.symb}', '${item.updown}', ${item.continuous}, ${item.stckClpr}, '${item.basedate}')
        ON DUPLICATE KEY UPDATE
          updown = VALUES(updown),
          continuous = VALUES(continuous),
          stckClpr = VALUES(stckClpr),
          basedate = VALUES(basedate);
      `;

      await exeQuery(sql).catch((e) => {
        console.log(`'${item.excd}', '${item.symb}' insert failed`);
      });
    }

    return true;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
  }
}

export async function getLastDay() {
  try {
    const sql = `
        SELECT MIN(basedate)
          FROM OVERSEA_CONTINUOUS_INFO;
      `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    console.log(lastday);
    return lastday;
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
    return null;
  }
}
