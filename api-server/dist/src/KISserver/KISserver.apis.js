"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("../../config");
let ApiService = class ApiService {
    async getDetail(params, period) {
        const apiUrl = `http://${config_1.default.kis_server.IP}:${config_1.default.kis_server.PORT}/api/HHDFS76240000`;
        const requestData = {
            params: params,
            period: period,
        };
        const recvData = await axios_1.default.post(apiUrl, requestData);
        return recvData.data;
    }
};
ApiService = __decorate([
    (0, common_1.Injectable)()
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=KISserver.apis.js.map