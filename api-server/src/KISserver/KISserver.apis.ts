import { Injectable } from '@nestjs/common';
import axios from 'axios';
import CONFIG from 'config';

@Injectable()
export class ApiService {
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
  }
}
