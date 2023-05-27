import { KISclients } from '../KIS/KISWS';
import { Socket } from 'socket.io';

export const overseaModel = {
  token: {
    access_token: null,
    token_type: null,
    access_token_token_expired: new Date(),
    expires_in: null,
  },
  approval_key: null,
  hashkey: null,
};

export const HDFSCNT0 = {
  target_clients: new Map<string, Set<any>>(),
  client_targets: new Map<any, Set<string>>(),
  add(client: Socket, target: string) {
    if (!this.target_clients.has(target)) {
      this.target_clients.set(target, new Set<any>());
    }
    if (!this.client_targets.has(client)) {
      this.client_targets.set(client, new Set<string>());
    }
    const clients = this.target_clients.get(target);
    const targets = this.client_targets.get(client);
    clients.add(client);
    targets.add(target);
    KISclients.messageHandlers.HDFSCNT0.send(target);
  },
  delete(client: Socket, target: string) {
    const clients = this.target_clients.get(target);
    const targets = this.client_targets.get(client);
    clients.delete(client);
    targets.delete(target);
    if (clients.size === 0) {
      this.target_clients.delete(target);
    }
    if (targets.size === 0) {
      this.client_targets.delete(client);
    }
  },
  deleteClient(client: Socket) {
    const targets = this.client_targets.get(client)
      ? this.client_targets.get(client)
      : [];
    for (const target of targets) {
      this.delete(client, target);
    }
  },
  sendData(target: string, data: any) {
    const clients = this.target_clients.get(target)
      ? this.target_clients.get(target)
      : [];
    for (const client of clients) {
      client.emit('HDFSCNT0', data);
    }
  },
};
