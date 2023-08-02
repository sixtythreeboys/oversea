import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
export declare class APIserverGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    afterInit(server: any): void;
    getChangedCallback(recv: any): Promise<void>;
    handleConnection(client: WebSocket, ...args: any[]): void;
    handleDisconnect(client: WebSocket): void;
    message(client: WebSocket, data: any): void;
}
