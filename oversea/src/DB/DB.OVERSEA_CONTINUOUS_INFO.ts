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
    INSERT INTO OVERSEA_CONTINUOUS_INFO
      (excd, symb, updown, continuous, stckClpr, basedate)
      VALUES
      ('${item.excd}', '${item.symb}', '${item.updown ?? 'null'}', ${
        item.continuous ?? 'null'
      }, ${item.stckClpr ?? 'null'}, '${item.basedate ?? 'null'}')
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
        SELECT MIN(basedate) as lastD
          FROM OVERSEA_CONTINUOUS_INFO;
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

export async function getData(excd, symb) {
  try {
    const sql = ` 
        select updown, continuous, stckClpr, basedate
          from OVERSEA_CONTINUOUS_INFO oci
         where excd = '${excd}'
           and symb = '${symb}';
         `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    return lastday[0];
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
    return null;
  }
}

export async function getDataByOption(period: number, avlsScal: number) {
  try {
    const sql = ` 
    select excd, symb
      from OVERSEA_CONTINUOUS_INFO oci
     where continuous >= ${Math.abs(period)}
       and CONVERT(stckClpr, FLOAT) ${
         avlsScal === 0
           ? 'is not null'
           : avlsScal < 0
           ? `<= ${Math.abs(avlsScal)}`
           : `>= ${Math.abs(avlsScal)}`
       } 
       and updown ${
         period === 0 ? 'is not null' : period > 0 ? `= 'U'` : `= 'D'`
       };
      `;
    const recvData = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    return recvData;
  } catch (err) {
    console.log(err);
    return null;
  }
}
