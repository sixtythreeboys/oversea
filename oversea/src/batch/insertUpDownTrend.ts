// [
//     {"xymd":"20230526","clos":"175.4300","sign":"2","diff":"2.4400","rate":"+1.41","open":"173.3200","high":"175.7700","low":"173.1100","tvol":"54834975","tamt":"9604219813","pbid":"175.4500","vbid":"10","pask":"175.6000","vask":"50"}
//     {"xymd":"20230525","clos":"172.9900","sign":"2","diff":"1.1500","rate":"+0.67","open":"172.4100","high":"173.8950","low":"171.6900","tvol":"56058258","tamt":"9741557514","pbid":"172.8500","vbid":"100","pask":"172.8800","vask":"200"}
// ]

import { APIS } from "src/KIS/KISAPIS";

export async function insertUpDownTrend(){
    const [EXCD, SYMB] = ['NAS','APPL'];
    const dataList = await APIS.HHDFS76240000(
      {
        EXCD: EXCD,
        SYMB: SYMB,
        name: '-',
      } as any,
      1,
    );
    const { status, data } = dataList as any;
    console.log(dataList);
}