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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverseaGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const oversea_model_1 = require("./oversea.model");
const MongoDB_HHDFS76200200_1 = require("../MongoDB/Model/MongoDB.HHDFS76200200");
let OverseaGateway = class OverseaGateway {
    afterInit(server) {
        console.log('oversea WS inited');
    }
    handleConnection(client, ...args) {
        console.log('Client connected' + client);
    }
    handleDisconnect(client) {
        try {
            oversea_model_1.overseaModel.wsClients.delete(client);
        }
        catch (e) { }
        console.log('Client disconnected' + client);
    }
    onMessage(client, data) {
        console.log('message');
        console.log(data);
    }
    async subscribe(client, rsym) {
        let data = null;
        const isExist = await MongoDB_HHDFS76200200_1.HHDFS76200200.exists({ rsym });
        if (isExist) {
            oversea_model_1.overseaModel.wsClients.add(client, rsym);
            data = { msg: '종목 구독 완료' };
        }
        else {
            data = { msg: '해당 종목 없음' };
        }
        return { event: 'message', data };
    }
    async unsubscribe(client) {
        oversea_model_1.overseaModel.wsClients.delete(client);
        return { event: 'message', data: { msg: '종목 구독 해제' } };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], OverseaGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OverseaGateway.prototype, "onMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('rsym')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], OverseaGateway.prototype, "subscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], OverseaGateway.prototype, "unsubscribe", null);
OverseaGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: 'oversea/socket' })
], OverseaGateway);
exports.OverseaGateway = OverseaGateway;
//# sourceMappingURL=oversea.gateway.js.map