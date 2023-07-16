import axios from 'axios';
import config from 'config';
import kisModel from './KIS.model';

export async function updateToken() {
  const res = await axios({
    method: 'post',
    url: `${config.KIS.real}${config.KIS.urls.접근토큰발급.path}`,
    headers: { 'content-type': 'application/json' },
    data: {
      grant_type: 'client_credentials',
      appkey: config.KIS.appkey,
      appsecret: config.KIS.appsecret,
    },
  });
  const [Y, M, D, h, m, s] = res.data.access_token_token_expired.split(/[- :]/);

  res.data.access_token_token_expired = new Date(Y, M - 1, D, h, m, s);

  kisModel.token = res.data;

  console.log('token updated : ' + JSON.stringify(kisModel.token));
}

export async function checkTokenMiddleware() {
  if (kisModel.token.access_token_token_expired <= new Date())
    await updateToken();
}
