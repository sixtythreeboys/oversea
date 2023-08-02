"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketsClient = void 0;
const common_1 = require("@nestjs/common");
const socket_io_client_1 = require("socket.io-client");
const config_1 = require("../../config");
const oversea_model_1 = require("../oversea/oversea.model");
let WebsocketsClient = class WebsocketsClient {
    constructor() {
        this.reconnect();
        this.initListeners();
    }
    reconnect() {
        this.socket = (0, socket_io_client_1.io)(config_1.default.kis_server.WS);
    }
    initListeners() {
        this.socket.on('getChanged', (data) => {
            var _a;
            if (!data.rsym)
                return;
            const clients = (_a = oversea_model_1.overseaModel.wsClients.rsyms.get(data.rsym)) !== null && _a !== void 0 ? _a : new Set();
            for (const client of clients) {
                client.emit('message', { data });
            }
        });
        const reconnect = this.reconnect;
        this.socket.on('disconnected', () => {
            this.socket = null;
            const INTV = setInterval(() => {
                if (this.socket !== null) {
                    clearInterval(INTV);
                    return;
                }
                reconnect();
            }, config_1.default.kis_server.reconnectIntv);
        });
    }
    sendMessage(message) {
        this.socket.emit('message', message);
    }
};
WebsocketsClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WebsocketsClient);
exports.WebsocketsClient = WebsocketsClient;
//# sourceMappingURL=KISserver.WebsocketsClient.js.map