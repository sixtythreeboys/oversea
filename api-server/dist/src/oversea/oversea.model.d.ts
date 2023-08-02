export declare const overseaModel: {
    wsClients: {
        rsyms: Map<string, Set<WebSocket>>;
        clients: Map<WebSocket, string>;
        add(client: WebSocket, rsym: string): void;
        delete(client: WebSocket): void;
    };
};
