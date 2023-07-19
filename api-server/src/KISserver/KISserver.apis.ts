import axios from 'axios';
import CONFIG from 'config';

export const APIS = {
  async getDetail(params: any, period: number) {
    const apiUrl = `http://${CONFIG.kis_server.IP}:${CONFIG.kis_server.PORT}/api/HHDFS76240000`;
    const requestData = {
      params: params,
      period: period,
    };
    const recvData: { status; headers; data } = await axios.post(
      apiUrl,
      requestData,
    );
    return recvData.data;
  },
};
