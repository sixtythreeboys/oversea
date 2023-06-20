import { dbModel } from './DB.model';
import { exeQuery } from './DB.service';

export class OVERSEA_CONTINUOUS_INFO {
  excd: string;
  symb: string;
  continuous?: number | null;
  stckClpr?: number | null;
  prdyAvlsScal?: number | null;
  prdyCtrt?: number | null;
  totalCtrt?: number | null;
  htsKorIsnm?: string | null;
  xymd: string;

  constructor(excd: string, symb: string, xymd: string) {
    this.excd = excd;
    this.symb = symb;
    this.xymd = xymd;
  }
}

export const services = {
  async getDataByOption(data: { period: number; avlsScal: number }) {
    const { period, avlsScal } = data;
    const conditions = [
      (() =>
        period === 0
          ? `abs(continuous) = (
        select MAX(abs(continuous))
          from OVERSEA_CONTINUOUS_INFO B 
         where A.excd = B.excd and A.symb = B.symb)`
          : `continuous = ${period}`)(),
      (() => {
        if (avlsScal === 0) {
          return null;
        } else if (avlsScal > 0) {
          return `stckClpr >= ${Math.abs(avlsScal)}`;
        } else {
          return `stckClpr <= ${Math.abs(avlsScal)}`;
        }
      })(),
    ].filter((e) => e !== null);

    const sql = `
      SELECT excd,symb,continuous,stckClpr,prdyAvlsScal,prdyCtrt,totalCtrt,htsKorIsnm,xymd
      FROM OVERSEA_CONTINUOUS_INFO A
      WHERE ${[' 1=1 ', ...conditions].join(' AND ')};
    `;

    const recvData: any[] = (await exeQuery(sql)) as any[];

    return recvData;
  },

  async mergeList(itemList: OVERSEA_CONTINUOUS_INFO[]): Promise<boolean> {
    for (const item of itemList) {
      const sql = `
        INSERT INTO OVERSEA_CONTINUOUS_INFO A
          (excd, symb, continuous, stckClpr, prdyAvlsScal, prdyCtrt, totalCtrt, htsKorIsnm, xymd)
          VALUES
          ('${item.excd}', '${item.symb}', ${item.continuous ?? 'null'}, ${
        item.stckClpr ?? 'null'
      }, ${item.prdyAvlsScal ?? 'null'}, ${item.prdyCtrt ?? 'null'}, ${
        item.totalCtrt ?? 'null'
      }, (select MAX(knam) from OVERSEA_ITEM_MAST B where A.excd = B.excd and A.symb = B.symb), '${
        item.xymd
      }')
        ON DUPLICATE KEY UPDATE
          continuous = VALUES(continuous),
          stckClpr = VALUES(stckClpr),
          prdyAvlsScal = VALUES(prdyAvlsScal),
          prdyCtrt = VALUES(prdyCtrt),
          totalCtrt = VALUES(totalCtrt),
          htsKorIsnm = VALUES(htsKorIsnm);
      `;

      await exeQuery(sql).catch((e) => {
        console.log(`'${item.excd}', '${item.symb}' insert failed`);
      });
    }

    return true;
  },

  async getLastDay() {
    const sql = `
      SELECT MAX(xymd) AS lastD
      FROM OVERSEA_CONTINUOUS_INFO;
    `;

    const lastday = await exeQuery(sql).catch((e) => {
      console.log(`'getLastDay' failed`);
    });

    return lastday[0] ? lastday[0].lastD : null;
  },

  async getData(excd: string, symb: string) {
    const sql = `
      SELECT excd, symb, continuous, stckClpr, prdyAvlsScal, prdyCtrt, totalCtrt, htsKorIsnm, xymd
      FROM OVERSEA_CONTINUOUS_INFO
      WHERE excd = '${excd}'
      AND symb = '${symb}'
      ORDER BY xymd desc;
    `;

    const recvData = await exeQuery(sql).catch((e) => {
      console.log(`'getData' failed`);
      return null;
    });

    return recvData;
  },
  async deleteData(excd: string, symb: string) {
    const sql = `
      DELETE
        FROM OVERSEA_CONTINUOUS_INFO
       WHERE excd = '${excd}'
         AND symb = '${symb}';
    `;

    const recvData = await exeQuery(sql).catch((e) => {
      console.log(`'deleteData' failed`);
      return null;
    });

    return true;
  },
};
