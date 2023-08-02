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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIserverGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const KIS_model_1 = require("../KIS/KIS.model");
const KIS_refreshLoop_service_1 = require("../KIS/KIS.refreshLoop.service");
let APIserverGateway = class APIserverGateway {
    afterInit(server) {
        console.log('oversea WS inited');
    }
    async getChangedCallback(recv) {
        KIS_model_1.default.apiServerWsClient.emit('getChanged', recv.data);
    }
    handleConnection(client, ...args) {
        KIS_model_1.default.apiServerWsClient = client;
        KIS_refreshLoop_service_1.LoopCallback.add(this.getChangedCallback);
    }
    handleDisconnect(client) {
        KIS_model_1.default.apiServerWsClient = null;
        KIS_refreshLoop_service_1.LoopCallback.delete(this.getChangedCallback);
    }
    message(client, data) {
        console.log('ws : message = ' + data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], APIserverGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], APIserverGateway.prototype, "message", null);
APIserverGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'socket',
    })
], APIserverGateway);
exports.APIserverGateway = APIserverGateway;
//# sourceMappingURL=APIserver.gateway.js.map