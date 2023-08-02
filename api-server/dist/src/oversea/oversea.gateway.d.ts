import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
export declare class OverseaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    afterInit(server: any): void;
    handleConnection(client: WebSocket, ...args: any[]): void;
    handleDisconnect(client: WebSocket): void;
    onMessage(client: any, data: any): void;
    subscribe(client: WebSocket, rsym: any): Promise<void>;
    unsubscribe(client: WebSocket): Promise<void>;
}
