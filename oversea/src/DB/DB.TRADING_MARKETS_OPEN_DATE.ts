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
): Promise<boolean> {
  try {
    for (const item of itemList) {
      const sql = `
      INSERT INTO TRADING_MARKETS_OPEN_DATE (prdt_type_cd, tr_natn_cd, tr_natn_name, natn_eng_abrv_cd, tr_mket_cd, tr_mket_name, acpl_sttl_dt, dmst_sttl_dt, baseymd)
      VALUES ('${item.prdt_type_cd}', '${item.tr_natn_cd}', '${item.tr_natn_name}', '${item.natn_eng_abrv_cd}', '${item.tr_mket_cd}', '${item.tr_mket_name}', '${item.acpl_sttl_dt}', '${item.dmst_sttl_dt}', '${item.baseymd}')
      ON DUPLICATE KEY UPDATE
          prdt_type_cd = '${item.prdt_type_cd}',
          tr_natn_cd = '${item.tr_natn_cd}',
          tr_natn_name = '${item.tr_natn_name}',
          tr_mket_cd = '${item.tr_mket_cd}',
          tr_mket_name = '${item.tr_mket_name}',
          acpl_sttl_dt = '${item.acpl_sttl_dt}',
          dmst_sttl_dt = '${item.dmst_sttl_dt}';
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
