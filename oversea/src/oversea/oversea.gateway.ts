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
import { HDFSCNT0 as HDFSCNT0_map } from './oversea.model';

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
    HDFSCNT0_map.deleteClient(client);
    console.log('Client disconnected' + client);
  }
  @SubscribeMessage('watch')
  watch(@MessageBody() tr_key: any) {
    return { test: 'test' };
  }
}
