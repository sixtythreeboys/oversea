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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIController = void 0;
const common_1 = require("@nestjs/common");
const KIS_API_service_1 = require("../KIS/KIS.API.service");
const config_1 = require("../../config");
let APIController = class APIController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async test(res, params) {
        try {
            res.status(200).send(true);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
    async HHDFS76240000(res, params, period) {
        try {
            period =
                period && period !== 0
                    ? period
                    : config_1.default.KIS.urls.해외주식_기간별시세.defaultLength;
            const data = await this.apiService.HHDFS76240000(params, period);
            res.status(200).send(data);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('HHDFS76240000'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)('params')),
    __param(2, (0, common_1.Body)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "HHDFS76240000", null);
APIController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [KIS_API_service_1.KISApiService])
], APIController);
exports.APIController = APIController;
//# sourceMappingURL=APIserver.controller.js.map