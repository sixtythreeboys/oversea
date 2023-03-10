export default {
  APP: {
    PORT: '8082',
    MAC_ADDRESS: '000000000000',
    PHONE_NUM: '01012345678',
    IP_ADDR: '172.31.35.144',
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
    appkey: 'PSM3WXIVMo4X2UnaIJCubQl4M9RCNfbm5C6V',
    appsecret:
      '6J/t0za0MCCNCb74d0+/71iexBomHiT6NQJqx4YZandzS3k5Zb+gzgKdbyludx8xGnTzecmPpjspCteGLnGMVOnOIRpOCBV6Cqax4+xPkpj2rvk4NjNs8YR4PeGWoTb35T+wCnGYgalMOtoj1wcK4WDkg0XXA77jz+rE5qxULJbyA683TV8=',
    hashkey: null,
  },
  EUREKA: {
    instance: {
      app: 'oversea',
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      instanceId: 'oversea',
      statusPageUrl: 'http://localhost:8082',
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
      host: 'localhost',
      port: '8761',
      servicePath: '/eureka/apps',
      //preferIpAddress: true, // This will use the IP address instead of the hostname for registration
      fetchRegistry: true,
      registerWithEureka: true,
      // serviceUrls: {
      //   default: 'http://localhost:8761/eureka/', // Replace with your own Eureka server URL
      // },
    },
  },
  MYSQL: {
    host: 'mysql://127.0.0.1:3306/domestic?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul&zeroDateTimeBehavior=convertToNull&rewriteBatchedStatements=true',
    user: 'root',
    password: '1q2w3e4r',
    database: 'mysql',
  },
};
