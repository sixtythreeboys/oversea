import { Injectable } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import config from 'config';

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
      console.log('Received message from server:', data);
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
