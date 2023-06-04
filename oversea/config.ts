export default {
  APP: {
    PORT: '8082',
    MAC_ADDRESS: '000000000000',
    PHONE_NUM: '01012345678',
    IP_ADDR: '172.31.36.186',
  },
  COMMON: {
    delayingQueue: {
      bufferSize: 17,
    },
  },
  KIS: {
    real: 'https://openapi.koreainvestment.com:9443',
    vts: 'https://openapivts.koreainvestment.com:29443',
    urls: {
      해외주식_현재체결가: {
        path: '/uapi/overseas-price/v1/quotations/price',
        tr_id: 'HHDFS00000300',
      },
      해외주식_기간별시세: {
        path: '/uapi/overseas-price/v1/quotations/dailyprice',
        tr_id: 'HHDFS76240000',
        defaultLength: 100,
      },
      해외주식조건검색: {
        path: '/uapi/overseas-price/v1/quotations/inquire-search',
        tr_id: 'HHDFS76410000',
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
  EUREKA: {
    instance: {
      app: 'oversea',
      hostName: 'ec2-3-136-15-208.us-east-2.compute.amazonaws.com',
      ipAddr: 'ec2-3-136-15-208.us-east-2.compute.amazonaws.com',
      instanceId: 'oversea',
      statusPageUrl:
        'http://ec2-3-136-15-208.us-east-2.compute.amazonaws.com:8082/test',
      port: {
        $: 8082,
        '@enabled': true,
      },
      vipAddress: 'oversea',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: '15.164.171.244',
      port: '8761',
      servicePath: '/eureka/apps',
      //preferIpAddress: true, // This will use the IP address instead of the hostname for registration
      fetchRegistry: true,
      registerWithEureka: true,
      // serviceUrls: {
      //   default: 'http://15.164.171.244:8761/eureka/', // Replace with your own Eureka server URL
      // },
    },
  },
  MYSQL: {
    host: '15.164.171.244',
    user: 'root',
    password: '1q2w3e4r',
    database: 'oversea',
  },
};
