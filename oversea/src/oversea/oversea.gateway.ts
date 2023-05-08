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
import { Server, Socket } from 'socket.io';
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
  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected' + client);
  }
  handleDisconnect(client: Socket) {
    HDFSCNT0_map.deleteClient(client);
    console.log('Client disconnected' + client);
  }
  @SubscribeMessage('HDFSCNT0')
  HDFSCNT0(
    @ConnectedSocket() client: Socket,
    @MessageBody('tr_key') tr_key: any,
  ) {
    HDFSCNT0_map.add(client, tr_key);
    console.log('ws : HDFSCNT0 = ' + tr_key);
  }
}