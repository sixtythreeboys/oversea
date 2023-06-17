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
export const services = {
  // 조건검색
  async getDataByOption(data: { period: number; avlsScal: number }) {
    const { period, avlsScal } = data;
    const conditions = [
      (() => {
        if (period === 0) {
          return null;
        } else if (period > 0) {
          return `continuous >= ${period}`;
        } else {
          return `continuous <= ${period}`;
        }
      })(),
      (() => {
        if (avlsScal === 0) {
          return null;
        } else if (avlsScal > 0) {
          return `CONVERT(stckClpr, FLOAT) >= ${Math.abs(avlsScal)}`;
        } else {
          return `CONVERT(stckClpr, FLOAT) <= ${Math.abs(avlsScal)}`;
        }
      })(),
    ].filter((e) => e !== null);
    const sql = ` 
    select excd, symb
      from OVERSEA_CONTINUOUS_INFO oci
     where ${[' 1=1 ', ...conditions].join(' and ')};
      `;

    const recvData = sql; //await exeQuery(sql);
    return recvData;
  },
  //키값이 겹칠경우 UPDATE, 아니면 INSERT
  async mergeList(itemList: OVERSEA_CONTINUOUS_INFO[]): Promise<boolean> {
    for (const item of itemList) {
      console.log(item);
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
  },
  // 가장 최근 갱신일을 저장
  async getLastDay() {
    const sql = `
          SELECT MIN(basedate) as lastD
            FROM OVERSEA_CONTINUOUS_INFO;
        `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay failed`);
    });
    return lastday[0].lastD;
  },
  // 특정 아이템 검색
  async getData(excd, symb) {
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
  },
};
