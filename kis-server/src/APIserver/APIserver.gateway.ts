import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import KISModel from 'src/KIS/KIS.model';
import { LoopCallback } from 'src/KIS/KIS.refreshLoop.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
export class APIserverGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {
    console.log('oversea WS inited');
  }
  async getChangedCallback(recv) {
    KISModel.apiServerWsClient.emit('getChanged', recv.data);
  }
  handleConnection(client: WebSocket, ...args: any[]) {
    //console.log('Client connected' + client);
    KISModel.apiServerWsClient = client;
    LoopCallback.add(this.getChangedCallback);
  }
  handleDisconnect(client: WebSocket) {
    //console.log('Client disconnected' + client);
    KISModel.apiServerWsClient = null;
    LoopCallback.delete(this.getChangedCallback);
  }

  @SubscribeMessage('message')
  message(
    @ConnectedSocket() client: WebSocket,
    @MessageBody('data') data: any,
  ) {
    console.log('ws : message = ' + data);
  }
}
