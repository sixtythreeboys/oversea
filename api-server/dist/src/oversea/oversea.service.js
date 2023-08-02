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
exports.OverseaService = void 0;
const common_1 = require("@nestjs/common");
const KISserver_apis_1 = require("../KISserver/KISserver.apis");
const MongoDB_HHDFS76200200_1 = require("../MongoDB/Model/MongoDB.HHDFS76200200");
const MongoDB_CONTINUOUS_INFO_1 = require("../MongoDB/Model/MongoDB.CONTINUOUS_INFO");
let OverseaService = class OverseaService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async list({ period, avlsScal }) {
        let results = [];
        const HHDFS76200200_Data = await MongoDB_HHDFS76200200_1.HHDFS76200200.find(avlsScal > 0
            ? { tomv: { $gt: Math.abs(avlsScal) } }
            : avlsScal < 0
                ? { tomv: { $lt: Math.abs(avlsScal) } }
                : {});
        const HHDFS76200200_Map = Object.fromEntries(HHDFS76200200_Data.map((e) => [e.rsym, e]));
        if (period === 0) {
            for (const data of HHDFS76200200_Data) {
                const [excd, symb] = [
                    data.rsym.substring(1, 4),
                    data.rsym.substring(4),
                ];
                results.push({
                    tomv: data.tomv,
                    excd: excd,
                    mkscShrnIscd: symb,
                    htsKorIsnm: data.knam,
                    stckClpr: data.base,
                    prdyAvlsScal: '-',
                    prdyCtrt: 0,
                    totalCtrt: 0,
                });
            }
        }
        else {
            const continuous_Data = await MongoDB_CONTINUOUS_INFO_1.CONTINUOUS_INFO.find(period > 0
                ? { continuous: { $gt: period } }
                : period < 0
                    ? { continuous: { $lt: period } }
                    : {});
            for (const data of continuous_Data) {
                const key = `D${data.excd}${data.symb}`;
                if (HHDFS76200200_Map[key] !== undefined) {
                    results.push([HHDFS76200200_Map[key], data]);
                }
            }
            results = results
                .map(([data, conti]) => {
                try {
                    let totalCtrt = 0;
                    for (let i = 0; i < Math.abs(period); i++) {
                        totalCtrt = conti.datas[i].rate;
                    }
                    return {
                        tomv: data.tomv,
                        excd: conti.excd,
                        mkscShrnIscd: conti.symb,
                        htsKorIsnm: conti.htsKorIsnm,
                        stckClpr: data.base,
                        prdyAvlsScal: '-',
                        prdyCtrt: conti.datas[0].rate,
                        totalCtrt: totalCtrt,
                    };
                }
                catch (e) {
                    return null;
                }
            })
                .filter((e) => e);
        }
        results.sort((a, b) => b.tomv - a.tomv);
        return results;
    }
    async getDetail({ EXCD, 종목코드, 기간분류코드, period }) {
        const datas = await this.apiService.getDetail({
            EXCD: EXCD,
            SYMB: 종목코드,
            GUBN: {
                D: '0',
                W: '1',
                M: '2',
            }[기간분류코드],
            name: '-',
        }, period);
        return datas.map(({ xymd, clos, sign, diff, rate, open, high, low, tvol, tamt, pbid, vbid, pask, vask, }) => {
            return {
                stckBsopDate: xymd,
                stckClpr: clos,
                prdyVrssSign: sign,
                prdyVrss: diff,
                rate,
                stckOprc: open,
                stckHgpr: high,
                stckLwpr: low,
                acmlVol: tvol,
                acmlTrPbmn: tamt,
                pbid,
                vbid,
                pask,
                vask,
            };
        });
    }
};
OverseaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [KISserver_apis_1.ApiService])
], OverseaService);
exports.OverseaService = OverseaService;
//# sourceMappingURL=oversea.service.js.map