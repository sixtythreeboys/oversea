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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'oversea/socket',
})
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
    overseaModel.wsClients.delete(client);
    //console.log('Client disconnected' + client);
  }
  @SubscribeMessage('subscribe')
  //@SubscribeMessage('message')
  async subscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody('rsym') rsym: any,
  ) {
    const isExist = await HHDFS76200200.exists({ rsym });
    if (isExist) {
      overseaModel.wsClients.add(client, rsym);
      client.emit('message', { msg: '종목 구독 완료' });
    } else {
      client.emit('message', { msg: '해당 종목 없음' });
    }
  }
  @SubscribeMessage('unsubscribe')
  async unsubscribe(client: WebSocket) {
    overseaModel.wsClients.delete(client);
    client.emit('message', { msg: '종목 구독 해제' });
  }
}
