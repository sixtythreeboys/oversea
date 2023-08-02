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
exports.BatchUpdateContinuous = void 0;
const common_1 = require("@nestjs/common");
const MongoDB_CONTINUOUS_INFO_1 = require("../MongoDB/Model/MongoDB.CONTINUOUS_INFO");
const MongoDB_ITEM_MAST_1 = require("../MongoDB/Model/MongoDB.ITEM_MAST");
const KIS_API_service_1 = require("../KIS/KIS.API.service");
const config_1 = require("../../config");
const dateUtils_1 = require("../common/util/dateUtils");
const KIS_model_1 = require("../KIS/KIS.model");
let BatchUpdateContinuous = class BatchUpdateContinuous {
    constructor(apiService) {
        this.apiService = apiService;
        this.BASEDATE = null;
    }
    async makeNew({ excd, symb }) {
        function getContinueData(DataList) {
            const res = [];
            let dir = 0;
            for (const data of DataList) {
                for (const key of Object.keys(data)) {
                    if (!['xymd', 'sign'].includes(key)) {
                        data[key] = parseFloat(data[key]);
                    }
                }
                if (Object.values(data).includes(Number.NaN))
                    return [null, null];
                res.push(data);
                if (dir === -1 && data.rate > 0) {
                    break;
                }
                else if (dir === 1 && data.rate < 0) {
                    break;
                }
                if (dir === 0 && data.rate !== 0) {
                    dir = data.rate > 0 ? 1 : -1;
                }
            }
            let last = 0;
            for (const idx in res) {
                if (res[idx].rate * dir > 0)
                    last = parseInt(idx);
            }
            return [dir, res.slice(0, last + 1)];
        }
        let DataList = null;
        let dir = 0;
        for (let buffer = config_1.default.Batch.BufferSize;; buffer += config_1.default.Batch.BufferSize) {
            DataList = await this.apiService
                .HHDFS76240000({
                EXCD: excd,
                SYMB: symb,
                GUBN: '0',
                BYMD: (0, dateUtils_1.getDatestring)(this.BASEDATE),
            }, buffer)
                .catch((e) => {
                return null;
            });
            if (DataList === null)
                return;
            [dir, DataList] = getContinueData(DataList);
            if (DataList === null)
                return;
            if (DataList.length < buffer)
                break;
        }
        const htsKorIsnm = KIS_model_1.default.knamMap[`D${excd}${symb}`];
        const insertData = new MongoDB_CONTINUOUS_INFO_1.CONTINUOUS_INFO({
            excd: excd,
            symb: symb,
            continuous: DataList.length * dir,
            datas: DataList,
            htsKorIsnm: htsKorIsnm,
            cdate: new Date(),
        });
        try {
            insertData.save();
        }
        catch (e) {
            console.log('insertFailed');
            console.log(insertData);
        }
    }
    async updateContinuous(BASEDATE) {
        this.BASEDATE = BASEDATE;
        const ItemList = await MongoDB_ITEM_MAST_1.ITEM_MAST.find().then((e) => e.map(({ excd, symb }) => {
            return { excd, symb };
        }));
        await MongoDB_CONTINUOUS_INFO_1.CONTINUOUS_INFO.deleteMany({});
        for (const { excd, symb } of ItemList) {
            try {
                this.makeNew({ excd, symb });
            }
            catch (e) {
            }
        }
    }
};
BatchUpdateContinuous = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [KIS_API_service_1.KISApiService])
], BatchUpdateContinuous);
exports.BatchUpdateContinuous = BatchUpdateContinuous;
//# sourceMappingURL=Batch.updateContinuous.js.map