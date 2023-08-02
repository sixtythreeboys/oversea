"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KISModule = void 0;
const common_1 = require("@nestjs/common");
const KIS_API_service_1 = require("./KIS.API.service");
const KIS_refreshLoop_service_1 = require("./KIS.refreshLoop.service");
let KISModule = class KISModule {
};
KISModule = __decorate([
    (0, common_1.Module)({
        providers: [KIS_API_service_1.KISApiService, KIS_refreshLoop_service_1.KISLoopService],
        exports: [KIS_API_service_1.KISApiService, KIS_refreshLoop_service_1.KISLoopService],
    })
], KISModule);
exports.KISModule = KISModule;
//# sourceMappingURL=KIS.module.js.map