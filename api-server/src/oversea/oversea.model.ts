import { WebSocket } from 'ws';

export const overseaModel = {
  wsClients: {
    rsyms: new Map<string, Set<WebSocket>>(),
    clients: new Map<WebSocket, string>(),
    add(client: WebSocket, rsym: string) {
      if (!this.rsyms.has(rsym)) {
        this.rsyms.set(rsym, new Set<WebSocket>());
      }
      this.rsyms.get(rsym).add(client);
      this.clients.set(client, rsym);
    },
    delete(client: WebSocket) {
      const rsym = this.clients.get(client);
      this.rsyms.get(rsym).delete(client);
      if (this.rsyms.get(rsym).size() === 0) {
        this.rsyms.delete(rsym);
      }
      this.clients.delete(client);
    },
  },
};
