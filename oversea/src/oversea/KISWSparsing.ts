// 0|HDFSCNT0|002|DNASAAPL^AAPL^4^20230502^20230502^091912^20230502^221912^169.9200^170.1000^169.4200^169.7850^2^0.1950^+0.11^169.7700^169.7900^201^5^1^108464^18414163^24757^20513^82.86^1^DNASAAPL^AAPL^4^20230502^20230502^091912^20230502^221912^169.9200^170.1000^169.4200^169.7900^2^0.2000^+0.12^169.7700^169.7900^201^2^3^108467^18414672^24757^20516^82.87^1
// 0|HDFSCNT0|001|DNASAAPL^AAPL^4^20230502^20230502^091913^20230502^221913^169.9200^170.1000^169.4200^169.8000^2^0.2100^+0.12^169.7700^169.7900^201^2^3^108470^18415181^24757^20519^82.88^1
// {"header":{"tr_id":"PINGPONG","datetime":"20230502221924"}}
// 0|HDFSCNT0|001|DNASAAPL^AAPL^4^20230502^20230502^091923^20230502^221923^169.9200^170.1000^169.4200^169.7850^2^0.1950^+0.11^169.7700^169.7900^201^2^6^108476^18416200^24757^20519^82.88^1
// 0|HDFSCNT0|001|DNASAAPL^AAPL^4^20230502^20230502^091933^20230502^221933^169.9200^170.1000^169.4200^169.7700^2^0.1800^+0.11^169.7700^169.7900^377^102^500^108976^18501085^25257^20519^81.24^1

import { CryptoJS } from 'crypto-js';

/** AES256 DECODE IV, KEY 선언*****/
let encryptkey = '';
let iv = '';

function aes256Decode(secretKey, Iv, data) {
  const cipher = CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: CryptoJS.enc.Utf8.parse(Iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    },
  );

  return cipher.toString(CryptoJS.enc.Utf8);
}

const parsers = {
  HDFSCNT0(dataList) {
    const cols = [
      '실시간종목코드',
      '종목코드',
      '수수점자리수',
      '현지영업일자',
      '현지일자',
      '현지시간',
      '한국일자',
      '한국시간',
      '시가',
      '고가',
      '저가',
      '현재가',
      '대비구분',
      '전일대비',
      '등락율',
      '매수호가',
      '매도호가',
      '매수잔량',
      '매도잔량',
      '체결량',
      '거래량',
      '거래대금',
      '매도체결량',
      '매수체결량',
      '체결강도',
      '시장구분',
    ];
    return Object.fromEntries(dataList.map((e, i) => [cols[i], e]));
  },
};

export function parseWSmessage(recvStr) {
  let res = null;
  // 첫데이터가 0이나 1일경우 (암호화 여부)
  if (recvStr[0] == 0 || recvStr[0] == 1) {
    let strArray = recvStr.split('|'); // 구분자로 문자열 자르기

    let trid = strArray[1]; // trid array
    let bodydata = strArray[3]; // receve data
    {
      if (strArray[0] == 1) {
        // aes256Decode function 을 사용해 key, iv, 암호화데이터를 넘겨 decode를 한다
        bodydata = aes256Decode(encryptkey, iv, bodydata);
      }
      try {
        res = {
          header: { tr_id: trid, count: parseInt(strArray[2]) },
          body: parsers[trid](bodydata.split('^')),
        };
      } catch (e) {
        console.log('ws parse failed : ' + e);
      }
    }
  } else {
    // 첫데이터가 암호화 구분값이 아닌 데이터를 처리하기위한 step
    try {
      res = JSON.parse(recvStr);
    } catch (e) {
      console.log('ws parse failed : ' + e);
    }
  }
  return res;
}
