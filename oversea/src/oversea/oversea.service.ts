import { Injectable } from '@nestjs/common';
import config from 'config';
import { HHDFS76410000, HHDFS76240000, makeHeader } from './oversea.type';
import axios from 'axios';
import { overseaModel } from './oversea.model';
import { markets } from './oversea.type';

//let mark = 0;

@Injectable()
export class OverseaService {
  async revokeP() {}
  async HHDFS76410000(params: HHDFS76410000) {
    return new Promise(function (resolve, reject) {
      let res = [];
      function HHDFS76410000(headers) {
        axios({
          method: 'get',
          url: `${config.KIS.vts}${config.KIS.urls.해외주식조건검색.path}`,
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
            if (['M'].includes(headers.tr_cont)) {
              HHDFS76410000({
                tr_id: 'HHDFS76410000',
                authorization: `${overseaModel.token.token_type} ${overseaModel.token.access_token}`,
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
        authorization: `${overseaModel.token.token_type} ${overseaModel.token.access_token}`,
        custtype: 'P',
      });
    });
  }
  async HHDFS76240000(params: HHDFS76240000, dateLength: number) {
    //console.log(mark++);
    return new Promise(function (resolve, reject) {
      let res = [];
      async function HHDFS76240000(headers) {
        await axios({
          method: 'get',
          url: `${config.KIS.vts}${config.KIS.urls.해외주식_기간별시세.path}`,
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
              dateLength - res.length >= 100
                ? ['M', 'F'].includes(headers.tr_cont)
                  ? output2
                  : output2.filter((e) => Object.values(e)[0] != '')
                : output2.slice(0, dateLength - res.length),
            );
            if (
              ['M', 'F'].includes(headers.tr_cont) &&
              res.length !== dateLength
            ) {
              HHDFS76240000({
                tr_id: 'HHDFS76240000',
                authorization: `${overseaModel.token.token_type} ${overseaModel.token.access_token}`,
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
        authorization: `${overseaModel.token.token_type} ${overseaModel.token.access_token}`,
        custtype: 'P',
      });
    });
  }

  async getList1(params: HHDFS76410000) {
    return new Promise(
      function (resolve, reject) {
        Promise.all(
          markets.map((market) => {
            return this.HHDFS76410000(
              Object.assign({ EXCD: market } as HHDFS76410000, params),
            );
          }),
        )
          .then((results) => {
            results = results
              .map(({ ststus, data }: any) => data)
              .reduce((a, c) => a.concat(c));
            resolve({ status: 200, data: results });
          })
          .catch((e) => {
            const { status, data } = e.response;
            reject({ status, data });
          });
      }.bind(this),
    );
  }
  async service1_1(datalength: number, target: 'UP' | 'DOWN', temp: number) {
    return new Promise(
      function (resolve, reject) {
        this.getList1({} as any)
          .then((e) => {
            return Promise.all(
              e.data
                .filter((e) => {
                  const rate = parseFloat(e.rate);
                  if (rate === 0.0) return false; //true
                  else {
                    if (target === 'UP' && rate > 0) return true;
                    else if (target === 'DOWN' && rate < 0) return true;
                    else return false;
                  }
                })
                .slice(0, temp) // 초당 횟수 초과 방지
                .map((item) => {
                  return this.HHDFS76240000(
                    {
                      EXCD: item.excd,
                      SYMB: item.symb,
                      name: '-',
                    } as any,
                    datalength,
                  ).then((e) => {
                    e.data = Object.assign(
                      { name: item.name, excd: item.excd, symb: item.symb },
                      e.data,
                    );
                    return e;
                  });
                }),
            );
          })
          .then((values) => {
            let res = values
              .map((e) => e.data)
              .filter((e) => {
                e = e.dataList.map((e) => parseFloat(e.rate));
                for (const rate of e) {
                  if (target === 'UP' && rate < 0) {
                    return false;
                  } else if (target === 'DOWN' && rate > 0) {
                    return false;
                  }
                }
                return true;
              });
            resolve({ status: 200, data: res });
          })
          .catch((e) => {
            reject(e.response);
          });
      }.bind(this),
    );
  }
  async service1_2() {}
}
