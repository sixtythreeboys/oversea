import { Injectable } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import config from 'config';
import { overseaModel } from 'src/oversea/oversea.model';

@Injectable()
export class WebsocketsClient {
  private socket: Socket;

  constructor() {
    this.reconnect();
    this.initListeners();
  }
  reconnect() {
    this.socket = io(config.kis_server.WS);
  }

  private initListeners(): void {
    this.socket.on('getChanged', (data) => {
      if (!data.rsym) return;
      const clients = overseaModel.wsClients.rsyms.get(data.rsym) ?? new Set();
      for (const client of clients) {
        client.send({ event: 'message', data });
      }
    });
    const reconnect = this.reconnect;
    this.socket.on('disconnected', () => {
      this.socket = null;
      const INTV = setInterval(() => {
        if (this.socket !== null) {
          clearInterval(INTV);
          return;
        }
        reconnect();
      }, config.kis_server.reconnectIntv);
    });
  }

  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
}
