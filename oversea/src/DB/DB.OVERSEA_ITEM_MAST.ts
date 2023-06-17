import { exeQuery } from './DB.service';

export interface OVERSEA_ITEM_MAST {
  ncod: string | null; // National code
  exid: string | null; // Exchange id
  excd: string | null; // Exchange code
  exnm: string | null; // Exchange name
  symb: string | null; // Symbol
  rsym: string | null; // Realtime symbol
  knam: string | null; // Korea name
  enam: string | null; // English name
  stis: string | null; // Security type: 1=Index, 2=Stock, 3=ETP(ETF), 4=Warrant
  curr: string | null; // Currency
  zdiv: string | null; // Float position
  ztyp: string | null; // Data type
  base: string | null; // Base price
  bnit: string | null; // Bid order size
  anit: string | null; // Ask order size
  mstm: string | null; // Market start time (HHMM)
  metm: string | null; // Market end time (HHMM)
  isdr: string | null; // DR 여부 (Y/N)
  drcd: string | null; // DR 국가코드
  icod: string | null; // 업종분류코드
  sjong: string | null; // 지수구성종목 존재 여부: 0=구성종목없음, 1=구성종목있음
  ttyp: string | null; // Tick size Type
  etyp: string | null; // ETF/ETN/ETC/... type
  ttyp_sb: string | null; // Tick size type 상세 (used when ttyp=9): 런던 제트라 유로넥스트
}
export const services = {
  async getItemList(): Promise<{ excd; symb }[]> {
    return exeQuery(
      `select distinct excd, symb from OVERSEA_ITEM_MAST;`,
    ) as Promise<{ excd; symb }[]>;
  },
  async getItemByKey(excd, symb) {
    const res = await exeQuery(
      `select ncod,exid,excd,exnm,symb,rsym,knam,enam,stis,curr,zdiv,ztyp,base,bnit,anit,mstm,metm,isdr,drcd,icod,sjong,ttyp,etyp,ttyp_sb
         from OVERSEA_ITEM_MAST
        where excd = '${excd}'
          and symb = '${symb}';`,
    );
    try {
      return res[0];
    } catch (e) {
      return null;
    }
  },
};
