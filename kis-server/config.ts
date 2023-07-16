export default {
  APP: {
    PORT: '8081',
  },
  COMMON: {
    delayingQueue: {
      bufferSize: 19,
      term: 1050,
    },
  },
  KIS: {
    real: 'https://openapi.koreainvestment.com:9443',
    urls: {
      해외결제일자조회: {
        path: '/uapi/overseas-stock/v1/quotations/countries-holiday',
        tr_id: 'CTOS5011R',
      },
      해외주식_현재가상세: {
        path: '/uapi/overseas-price/v1/quotations/price-detail',
        tr_id: 'HHDFS76200200',
      },
      접근토큰발급: {
        path: '/oauth2/tokenP',
      },
      접근토큰폐기: {
        path: '/oauth2/revokeP',
      },
    },
    appkey: 'PSHuOWS0dNyeHrVldYFAp9Kii96s6racw0QF',
    appsecret:
      'l+cjOqbMeNYNFCuc6yEuKhGcRLGO0BYFDiljX930/i+AZOaWZksy2Bhsu22RsMsY0TM8ZsabD3nSmX49dvhb2M5PaMiiGB+y8ptGxD/gUVQK4UtkkWcoNePjTj096+KIpubwkOobFlDbkNPcj7+yZFzroaLTs2lbENzA126L4Uyt834McuQ=',
    hashkey: null,
  },
  KIS_WS: {
    real: 'ws://ops.koreainvestment.com:21000',
    urls: {
      해외주식_실시간지연체결가: {
        path: '/tryitout/HDFSCNT0',
        tr_id: 'HDFSCNT0',
      },
    },
  },
  MongoDB: {
    connectString:
      'mongodb+srv://oversea:oversea@63stockoversea.hgudvi2.mongodb.net/?retryWrites=true&w=majority',
  },
};
