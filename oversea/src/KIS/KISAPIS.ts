import config from 'config';
import axios from 'axios';
import {
  HHDFS76410000,
  HHDFS76240000,
  makeHeader,
} from '../oversea/oversea.type';
import { enqueue } from 'src/common/util/delayingQueue';

export const APIS = {
  async oauth2Approval() {
    return axios.post(
      `${config.KIS.real}/oauth2/Approval`,
      {
        grant_type: 'client_credentials',
        appkey: config.KIS.appkey,
        secretkey: config.KIS.appsecret,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  },
  async HHDFS76410000(params: HHDFS76410000) {
    return new Promise(function (resolve, reject) {
      let res = [];
      function HHDFS76410000(headers) {
        axios({
          method: 'get',
          url: `${config.KIS.real}${config.KIS.urls.해외주식조건검색.path}`,
          headers: makeHeader(headers),
          params: Object.assign(
            { AUTH: '', EXCD: 'NAS' } as HHDFS76410000,
            params,
          ),
        })
          .then((e) => {
            const { status, headers, data } = e;
            const { output1, output2, rt_cd, msg_cd, msg1 } = data;
            res = res.concat(output2);
            if (rt_cd !== '0') {
              reject({ response: { status: 200, data: { rt_cd, msg1 } } });
            } else if (['M'].includes(headers.tr_cont)) {
              HHDFS76410000({
                tr_id: 'HHDFS76410000',
                custtype: 'P',
                tr_cont: 'N',
              });
            } else {
              resolve({
                status: status,
                data: res,
              });
            }
          })
          .catch((e) => {
            reject(e);
          });
      }
      HHDFS76410000({
        tr_id: 'HHDFS76410000',
        custtype: 'P',
      });
    });
  },
  async HHDFS76240000(params: HHDFS76240000, period: number) {
    //console.log(mark++);
    return new Promise(function (resolve, reject) {
      let res = [];
      async function HHDFS76240000(headers) {
        await axios({
          method: 'get',
          url: `${config.KIS.real}${config.KIS.urls.해외주식_기간별시세.path}`,
          headers: makeHeader(headers),
          params: Object.assign(
            {
              AUTH: '',
              EXCD: 'NAS',
              GUBN: '0',
              BYMD: '',
              MODP: '1',
            } as HHDFS76240000,
            params,
          ),
        })
          .then((e) => {
            const { status, headers, data } = e;
            const { output1, output2, rt_cd, msg_cd, msg1 } = data;
            res = res.concat(
              period - res.length >= 100
                ? ['M', 'F'].includes(headers.tr_cont)
                  ? output2
                  : output2.filter((e) => Object.values(e)[0] != '')
                : output2.slice(0, period - res.length),
            );
            if (['M', 'F'].includes(headers.tr_cont) && res.length !== period) {
              HHDFS76240000({
                tr_id: 'HHDFS76240000',
                custtype: 'P',
                tr_cont: 'N',
              });
            } else {
              resolve({
                status: status,
                data: {
                  dataList: res,
                },
              });
            }
          })
          .catch((e) => {
            reject(e);
          });
      }
      HHDFS76240000({
        tr_id: 'HHDFS76240000',
        custtype: 'P',
      });
    });
  },
};

for (const key of Object.keys(APIS).filter(
  (key) => typeof APIS[key] === 'function',
)) {
  APIS[key] = new Proxy(APIS[key], {
    apply: function (target, thisArg, argumentsList) {
      return enqueue(async function () {
        return target(...argumentsList);
      });
    },
  });
}
