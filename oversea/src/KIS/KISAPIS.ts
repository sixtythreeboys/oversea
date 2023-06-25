import config from 'config';
import axios from 'axios';
import {
  HHDFS76410000,
  HHDFS76240000,
  makeHeader,
  CTOS5011R,
  HHDFS76200200,
  FHKST03030100,
} from '../oversea/oversea.type';
import { enqueue } from 'src/KIS/delayingQueue';
import { getToday } from 'src/common/util/dateUtils';

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
  async HHDFS76410000(
    headers: any,
    params: HHDFS76410000,
  ): Promise<{ data: []; cont: 'Y' | 'N' }> {
    const recvData: { status; headers; data } = await axios({
      method: 'get',
      url: `${config.KIS.real}${config.KIS.urls.해외주식조건검색.path}`,
      headers: makeHeader(
        Object.assign(
          {
            tr_id: 'HHDFS76410000',
            custtype: 'P',
          },
          headers,
        ),
      ),
      params: Object.assign({ AUTH: '', EXCD: 'NAS' } as HHDFS76410000, params),
    });
    const { output1, output2, rt_cd, msg_cd, msg1 } = recvData.data;
    if (rt_cd !== '0') {
      throw { status: 500, data: { rt_cd, msg1 } };
    }
    return {
      data: output2,
      cont: ['M'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
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
  async CTOS5011R(headers: any, params: CTOS5011R) {
    const recvData: { status; headers; data } = await axios({
      method: 'get',
      url: `${config.KIS.real}${config.KIS.urls.해외주식_기간별시세.path}`,
      headers: makeHeader(
        Object.assign(
          {
            tr_id: 'CTOS5011R',
            custtype: 'P',
          },
          headers,
        ),
      ),
      params: Object.assign(
        {
          TRAD_DT: getToday(),
          CTX_AREA_NK: '',
          CTX_AREA_FK: '',
        } as CTOS5011R,
        params,
      ),
    });
    const { ctx_area_fk, ctx_area_nk, output, rt_cd, msg_cd, msg1 } =
      recvData.data;
    console.log();

    if (rt_cd !== '0') {
      throw { status: 500, data: { rt_cd, msg1 } };
    }
    return {
      data: output,
      cont: ['M'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
    };
  },
  async FHKST03030100(headers: any, params: FHKST03030100) {
    const TODAY = getToday();
    const recvData: { status; headers; data } = await axios({
      method: 'get',
      url: `${config.KIS.real}${config.KIS.urls['해외주식 종목/지수/환율기간별시세(일/주/월/년)'].path}`,
      headers: makeHeader(
        Object.assign(
          {
            tr_id: 'FHKST03030100',
            custtype: 'P',
          },
          headers,
        ),
      ),
      params: Object.assign(
        {
          FID_COND_MRKT_DIV_CODE: 'N',
          FID_INPUT_DATE_1: TODAY,
          FID_INPUT_DATE_2: TODAY,
          FID_PERIOD_DIV_CODE: 'D',
        } as FHKST03030100,
        params,
      ),
    });
    const { output, rt_cd, msg_cd, msg1 } = recvData.data;

    // if (rt_cd !== '0') {
    //   throw { status: 500, data: { rt_cd, msg1 } };
    // } else if (output.tomv === '') {
    //   throw { status: 500, data: { rt_cd, msg1: '유효하지않은 종목코드' } };
    // }
    // return {
    //   data: output,
    //   cont: ['M', 'F'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
    // };
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
};

export const APIS = {
  async oauth2Approval() {
    return APICallers.oauth2Approval();
  },
  async HHDFS76410000(params: HHDFS76410000) {
    let ret = [];
    let recvData = await APICallers.HHDFS76410000({}, params);
    ret = ret.concat(recvData.data);

    while (recvData.cont === 'Y') {
      recvData = await APICallers.HHDFS76410000({ tr_cont: 'N' }, params);
      ret = ret.concat(recvData.data);
    }
    return ret;
  },
  async HHDFS76240000(params: HHDFS76240000, period: number) {
    let ret = [];
    let recvData = await APICallers.HHDFS76240000({}, params);
    ret = ret.concat(recvData.data);
    while (recvData.cont === 'Y') {
      recvData = await APICallers.HHDFS76410000({ tr_cont: 'N' }, params);
      ret = ret.concat(recvData.data);
      if (ret.length >= period) {
        ret = ret.slice(0, period);
        break;
      }
    }
    return ret;
  },
  async CTOS5011R(params: any) {
    const recvData = await APICallers.CTOS5011R({}, params);
    return recvData;
  },
  async FHKST03030100(params: {
    FID_COND_MRKT_DIV_CODE: string;
    FID_INPUT_ISCD: string;
    FID_INPUT_DATE_1: string;
    FID_INPUT_DATE_2: string;
    FID_PERIOD_DIV_CODE: 'D' | 'W' | 'Y';
  }) {
    const recvData = await APICallers.FHKST03030100({}, params);
    return recvData;
  },
  async HHDFS76200200(params: any) {
    const recvData = await APICallers.HHDFS76200200({}, params);
    return recvData;
  },
};

for (const key of Object.keys(APICallers).filter(
  (key) => typeof APICallers[key] === 'function',
)) {
  APICallers[key] = new Proxy(APICallers[key], {
    apply: function (target, thisArg, argumentsList) {
      return enqueue(async function () {
        try {
          return target(...argumentsList);
        } catch (e) {
          return e;
        }
      });
    },
  });
}
