import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

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
  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected' + client);
  }
  handleDisconnect(client: any) {
    console.log('Client disconnected' + client);
  }
  @SubscribeMessage('watch')
  watch(@MessageBody() data: any) {
    return { test: 'test' };
  }
}
