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
