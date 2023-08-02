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
exports.OverseaController = void 0;
const common_1 = require("@nestjs/common");
const oversea_service_1 = require("./oversea.service");
let OverseaController = class OverseaController {
    constructor(oversea) {
        this.oversea = oversea;
    }
    async test(res, params) {
        try {
            res.status(200).send(true);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
    async list(res, period, avlsScal) {
        try {
            const resData = await this.oversea.list({
                period: period ? parseInt(period) : 0,
                avlsScal: avlsScal ? parseInt(avlsScal) : 0,
            });
            res.status(200).send(resData);
        }
        catch (e) {
            res.status(500).send('err : ' + e);
        }
    }
    async detail(res, EXCD, 종목코드, 기간분류코드, period) {
        function checkInputValidation() {
            EXCD = EXCD ? EXCD : 'NAS';
            if ([종목코드].includes(undefined)) {
                return false;
            }
            기간분류코드 = 기간분류코드 ? 기간분류코드.toUpperCase() : 'D';
            if (!['D', 'W', 'M'].includes(기간분류코드)) {
                return false;
            }
            if (Number.isNaN(period)) {
                return false;
            }
            return true;
        }
        if (checkInputValidation()) {
            this.oversea
                .getDetail({
                EXCD,
                종목코드,
                기간분류코드,
                period,
            })
                .then((e) => {
                const data = e;
                res.status(200).send(data);
            })
                .catch((e) => {
                res.status(500).send(e);
            });
        }
        else {
            res.status(500).send({ err: '잘못된 인자' });
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
], OverseaController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('avlsScal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OverseaController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('pirce-by-period'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('EXCD')),
    __param(2, (0, common_1.Query)('종목코드')),
    __param(3, (0, common_1.Query)('기간분류코드')),
    __param(4, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OverseaController.prototype, "detail", null);
OverseaController = __decorate([
    (0, common_1.Controller)('oversea'),
    __metadata("design:paramtypes", [oversea_service_1.OverseaService])
], OverseaController);
exports.OverseaController = OverseaController;
//# sourceMappingURL=oversea.controller.js.map