import config from 'config';
import kisModel from './KIS.model';

export type Markets =
  | 'NYS'
  | 'NAS'
  | 'AMS'
  | 'TSE'
  | 'HKS'
  | 'SHS'
  | 'SZS'
  | 'HSX'
  | 'HNX';

export type HHDFS76200200 = {
  AUTH: '';
  EXCD: Markets;
  SYMB: string;
};

export type Header = {
  'content-type'?: string;
  authorization?: string;
  appkey?: string;
  appsecret?: string;
  personalseckey?: string;
  tr_id: string;
  tr_cont?: string;
  custtype?: string;
  seq_no?: string;
  mac_address?: string;
  phone_number?: string;
  ip_addr?: string;
  hashkey?: string;
  gt_uid?: string;
};
export function makeHeader(params?: Header): Header {
  const res = {
    'content-type': 'application/json',
    appkey: config.KIS.appkey,
    appsecret: config.KIS.appsecret,
    authorization: `${kisModel.token.token_type} ${kisModel.token.access_token}`,
  };
  for (const key of Object.keys(params)) {
    res[key] = params[key];
  }
  return res as Header;
}
export function makeWSdata(body: any) {
  return {
    header: {
      approval_key: kisModel.approval_key,
      custtype: 'P',
      tr_type: '1',
      'content-type': 'utf-8',
    },
    body: {
      input: body,
    },
  };
}

export const markets: Markets[] = [
  'NYS',
  'NAS',
  'AMS',
  'TSE',
  'HKS',
  'SHS',
  'SZS',
  'HSX',
  'HNX',
];
