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
import { overseaModel } from './oversea.model';
import { HHDFS76200200 } from 'src/MongoDB/Model/MongoDB.HHDFS76200200';

@WebSocketGateway({ path: 'oversea/socket' })
export class OverseaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {
    console.log('oversea WS inited');
  }
  handleConnection(client: WebSocket, ...args: any[]) {
    //console.log('Client connected' + client);
  }
  handleDisconnect(client: WebSocket) {
    try {
      overseaModel.wsClients.delete(client);
    } catch (e) {}
    //console.log('Client disconnected' + client);
  }

  @SubscribeMessage('message')
  onMessage(client: any, data: any) {
    console.log('message');
    console.log(data);
  }

  @SubscribeMessage('subscribe')
  async subscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody('rsym') rsym: any,
  ) {
    let data = null;
    const isExist = await HHDFS76200200.exists({ rsym });
    if (isExist) {
      overseaModel.wsClients.add(client, rsym);
      data = { msg: '종목 구독 완료' };
    } else {
      data = { msg: '해당 종목 없음' };
    }
    return { event: 'message', data };
  }
  @SubscribeMessage('unsubscribe')
  async unsubscribe(client: WebSocket) {
    overseaModel.wsClients.delete(client);
    return { event: 'message', data: { msg: '종목 구독 해제' } };
  }
}
