"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KISApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../config");
const axios_1 = require("axios");
const KIS_delayingQueue_1 = require("./util/KIS.delayingQueue");
const KIS_type_1 = require("./KIS.type");
const KIS_middleware_1 = require("./KIS.middleware");
const APICallers = {
    async oauth2Approval() {
        return axios_1.default.post(`${config_1.default.KIS.real}/oauth2/Approval`, {
            grant_type: 'client_credentials',
            appkey: config_1.default.KIS.appkey,
            secretkey: config_1.default.KIS.appsecret,
        }, {
            headers: {
                'content-type': 'application/json',
            },
        });
    },
    async HHDFS76200200(headers, params) {
        const recvData = await (0, axios_1.default)({
            method: 'get',
            url: `${config_1.default.KIS.real}${config_1.default.KIS.urls.해외주식_현재가상세.path}`,
            headers: (0, KIS_type_1.makeHeader)(Object.assign({
                tr_id: 'HHDFS76200200',
                custtype: 'P',
            }, headers)),
            params: Object.assign({
                AUTH: '',
                EXCD: 'NAS',
            }, params),
        });
        const { output, rt_cd, msg_cd, msg1 } = recvData.data;
        if (rt_cd !== '0') {
            throw { status: 500, data: { rt_cd, msg1 } };
        }
        else if (output.tomv === '') {
            throw {
                status: 500,
                data: { rt_cd, msg1: '유효하지않은 종목코드' },
            };
        }
        return {
            data: output,
            cont: ['M', 'F'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
        };
    },
    async HHDFS76240000(headers, params) {
        const recvData = await (0, axios_1.default)({
            method: 'get',
            url: `${config_1.default.KIS.real}${config_1.default.KIS.urls.해외주식_기간별시세.path}`,
            headers: (0, KIS_type_1.makeHeader)(Object.assign({
                tr_id: 'HHDFS76240000',
                custtype: 'P',
            }, headers)),
            params: Object.assign({
                AUTH: '',
                EXCD: 'NAS',
                GUBN: '0',
                BYMD: '',
                MODP: '1',
            }, params),
        });
        const { output1, output2, rt_cd, msg_cd, msg1 } = recvData.data;
        if (rt_cd !== '0') {
            throw { status: 500, data: { rt_cd, msg1 } };
        }
        else if (output2[0].rate === '') {
            throw { status: 500, data: { rt_cd, msg1: '유효하지않은 종목코드' } };
        }
        return {
            data: output2,
            cont: ['M', 'F'].includes(recvData.headers.tr_cont) ? 'Y' : 'N',
        };
    },
};
for (const key of Object.keys(APICallers).filter((key) => typeof APICallers[key] === 'function')) {
    const enqueueFunc = ['HHDFS76240000'].includes(key) ? KIS_delayingQueue_1.enqueueFront : KIS_delayingQueue_1.enqueue;
    APICallers[key] = new Proxy(APICallers[key], {
        apply: function (target, thisArg, argumentsList) {
            return enqueueFunc(async function () {
                try {
                    await (0, KIS_middleware_1.checkTokenMiddleware)();
                    return target(...argumentsList);
                }
                catch (e) {
                    return e;
                }
            });
        },
    });
}
let KISApiService = class KISApiService {
    async oauth2Approval() {
        return APICallers.oauth2Approval();
    }
    async HHDFS76200200(params) {
        return APICallers.HHDFS76200200({}, params);
    }
    async HHDFS76240000(params, period) {
        let ret = [];
        let recvData = await APICallers.HHDFS76240000({}, params);
        ret = ret.concat(recvData.data);
        while (recvData.cont === 'Y') {
            recvData = await APICallers.HHDFS76240000({ tr_cont: 'N' }, params);
            ret = ret.concat(recvData.data);
            if (ret.length >= period) {
                ret = ret.slice(0, period);
                break;
            }
        }
        return ret;
    }
};
KISApiService = __decorate([
    (0, common_1.Injectable)()
], KISApiService);
exports.KISApiService = KISApiService;
//# sourceMappingURL=KIS.API.service.js.map