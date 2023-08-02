export declare class WebsocketsClient {
    private socket;
    constructor();
    reconnect(): void;
    private initListeners;
    sendMessage(message: string): void;
}
