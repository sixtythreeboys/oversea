import { getToday } from 'src/common/util/dateUtils';
import { dbModel } from './DB.model';
import { exeQuery } from './DB.service';

export type TRADING_MARKETS_OPEN_DATE = {
  prdt_type_cd: string;
  tr_natn_cd: string;
  tr_natn_name: string;
  natn_eng_abrv_cd: string;
  tr_mket_cd: string;
  tr_mket_name: string;
  acpl_sttl_dt: string; // Date in 'yyyy-mm-dd' format
  dmst_sttl_dt: string; // Date in 'yyyy-mm-dd' format
  baseymd: string;
};

export async function getLastDay() {
  try {
    const sql = `
        SELECT MAX(basedate) as lastD
          FROM TRADING_MARKETS_OPEN_DATE;
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
  itemList: TRADING_MARKETS_OPEN_DATE[],
  basedate,
): Promise<boolean> {
  try {
    for (const item of itemList) {
      const sql = `
    INSERT INTO TRADING_MARKETS_OPEN_DATE
      (prdt_type_cd, tr_natn_cd, tr_natn_name, natn_eng_abrv_cd, tr_mket_cd, tr_mket_name, acpl_sttl_dt, dmst_sttl_dt, baseymd)
      VALUES
      ('${item.prdt_type_cd ?? 'null'}', '${item.tr_natn_cd ?? 'null'}', '${
        item.tr_natn_name ?? 'null'
      }', '${item.natn_eng_abrv_cd ?? 'null'}',
       '${item.tr_mket_cd ?? 'null'}', '${item.tr_mket_name ?? 'null'}', '${
        item.acpl_sttl_dt ?? 'null'
      }', '${item.dmst_sttl_dt ?? 'null'}', '${basedate ?? 'null'}')
    ON DUPLICATE KEY UPDATE
      prdt_type_cd = '${item.prdt_type_cd ?? 'null'}',
      natn_eng_abrv_cd = '${item.natn_eng_abrv_cd ?? 'null'}',
      tr_natn_name = '${item.tr_natn_name ?? 'null'}',
      tr_mket_name = '${item.tr_mket_name ?? 'null'}',
      acpl_sttl_dt = '${item.acpl_sttl_dt ?? 'null'}',
      dmst_sttl_dt = '${item.dmst_sttl_dt ?? 'null'}';
        `;

      await exeQuery(sql).catch((e) => {
        console.log(
          `'${item.natn_eng_abrv_cd}', '${item.baseymd}' insert failed`,
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

export async function getNasOpenList(startdate, period) {
  try {
    const sql = `
select acpl_sttl_dt
  from TRADING_MARKETS_OPEN_DATE
 where tr_mket_name = '나스닥'
   and acpl_sttl_dt < '${startdate.substring(0, 4)}-${startdate.substring(
      4,
      6,
    )}-${startdate.substring(6, 8)}
 order byacpl_sttl_dt';
      `;

    const days = await exeQuery(sql)
      .then((e: any) => e.acpl_sttl_dt)
      .catch((e) => {
        console.log(`'getLastDay failed`);
      });
    return days.slice(days.length - period, days.length);
  } catch (err) {
    dbModel.connection.rollback(function () {
      throw err;
    });
    return null;
  }
}
