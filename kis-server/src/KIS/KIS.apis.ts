import config from 'config';
import axios from 'axios';
import { enqueue, enqueueFront } from 'src/KIS/KIS.delayingQueue';
import { HHDFS76200200, HHDFS76240000, makeHeader } from 'src/KIS/KIS.type';
import { checkTokenMiddleware } from './KIS.middleware';

export const APICallers = {
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

  async HHDFS76200200(headers: any, params: HHDFS76200200) {
    const recvData: { status; headers; data } = await axios({
      method: 'get',
      url: `${config.KIS.real}${config.KIS.urls.해외주식_현재가상세.path}`,
      headers: makeHeader(
        Object.assign(
          {
            tr_id: 'HHDFS76200200',
            custtype: 'P',
          },
          headers,
        ),
      ),
      params: Object.assign(
        {
          AUTH: '',
          EXCD: 'NAS',
        } as HHDFS76200200,
        params,
      ),
    });
    const { output, rt_cd, msg_cd, msg1 } = recvData.data;

    if (rt_cd !== '0') {
      throw { status: 500, data: { rt_cd, msg1 } };
    } else if (output.tomv === '') {
      throw { status: 500, data: { rt_cd, msg1: '유효하지않은 종목코드' } };
    }
    return {
      data: output,
      cont: ['M', 'F'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
    };
  },
  async HHDFS76240000(headers: any, params: HHDFS76240000) {
    const recvData: { status; headers; data } = await axios({
      method: 'get',
      url: `${config.KIS.real}${config.KIS.urls.해외주식_기간별시세.path}`,
      headers: makeHeader(
        Object.assign(
          {
            tr_id: 'HHDFS76240000',
            custtype: 'P',
          },
          headers,
        ),
      ),
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
    });
    const { output1, output2, rt_cd, msg_cd, msg1 } = recvData.data;

    if (rt_cd !== '0') {
      throw { status: 500, data: { rt_cd, msg1 } };
    } else if (output2[0].rate === '') {
      throw { status: 500, data: { rt_cd, msg1: '유효하지않은 종목코드' } };
    }
    return {
      data: output2,
      cont: ['M', 'F'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
    };
  },
};

export const APIS = {
  async oauth2Approval() {
    return APICallers.oauth2Approval();
  },
  async HHDFS76200200(params: any) {
    const recvData = await APICallers.HHDFS76200200({}, params);
    return recvData;
  },
  async HHDFS76240000(params: HHDFS76240000, period: number) {
    let ret = [];
    let recvData = await APICallers.HHDFS76240000({}, params);
    ret = ret.concat(recvData.data);
    while (recvData.cont === 'Y') {
      recvData = await APICallers.HHDFS76240000({ tr_cont: 'N' }, params);
      ret = ret.concat(recvData.data);
      if (ret.length >= period) {
        ret = ret.slice(0, period);
        break;
      }
    }
    return ret;
  },
};

for (const key of Object.keys(APICallers).filter(
  (key) => typeof APICallers[key] === 'function',
)) {
  const enqueueFunc = ['HHDFS76240000'].includes(key) ? enqueueFront : enqueue;
  APICallers[key] = new Proxy(APICallers[key], {
    apply: function (target, thisArg, argumentsList) {
      return enqueueFunc(async function () {
        try {
          await checkTokenMiddleware();
          return target(...argumentsList);
        } catch (e) {
          return e;
        }
      });
    },
  });
}
