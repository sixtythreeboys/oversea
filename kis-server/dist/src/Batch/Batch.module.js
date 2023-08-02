"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchModule = void 0;
const common_1 = require("@nestjs/common");
const Batch_service_1 = require("./Batch.service");
const Batch_updateContinuous_1 = require("./Batch.updateContinuous");
const KIS_module_1 = require("../KIS/KIS.module");
let BatchModule = class BatchModule {
};
BatchModule = __decorate([
    (0, common_1.Module)({
        imports: [KIS_module_1.KISModule],
        controllers: [],
        providers: [Batch_service_1.BatchService, Batch_updateContinuous_1.BatchUpdateContinuous],
    })
], BatchModule);
exports.BatchModule = BatchModule;
//# sourceMappingURL=Batch.module.js.map