import { KISclients } from './KISWS';

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
  add(client: any, target: string) {
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
  delete(client: any, target: string) {
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
  deleteClient(client: any) {
    for (const target of this.client_targets.get(client)) {
      this.delete(client, target);
    }
  },
};
