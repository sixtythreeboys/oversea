"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overseaModel = void 0;
exports.overseaModel = {
    wsClients: {
        rsyms: new Map(),
        clients: new Map(),
        add(client, rsym) {
            if (!this.rsyms.has(rsym)) {
                this.rsyms.set(rsym, new Set());
            }
            this.rsyms.get(rsym).add(client);
            this.clients.set(client, rsym);
        },
        delete(client) {
            const rsym = this.clients.get(client);
            this.rsyms.get(rsym).delete(client);
            if (this.rsyms.get(rsym).size() === 0) {
                this.rsyms.delete(rsym);
            }
            this.clients.delete(client);
        },
    },
};
//# sourceMappingURL=oversea.model.js.map