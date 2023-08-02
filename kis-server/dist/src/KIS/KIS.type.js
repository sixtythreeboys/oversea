"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markets = exports.makeWSdata = exports.makeHeader = void 0;
const config_1 = require("../../config");
const KIS_model_1 = require("./KIS.model");
function makeHeader(params) {
    const res = {
        'content-type': 'application/json',
        appkey: config_1.default.KIS.appkey,
        appsecret: config_1.default.KIS.appsecret,
        authorization: `${KIS_model_1.default.token.token_type} ${KIS_model_1.default.token.access_token}`,
    };
    for (const key of Object.keys(params)) {
        res[key] = params[key];
    }
    return res;
}
exports.makeHeader = makeHeader;
function makeWSdata(body) {
    return {
        header: {
            approval_key: KIS_model_1.default.approval_key,
            custtype: 'P',
            tr_type: '1',
            'content-type': 'utf-8',
        },
        body: {
            input: body,
        },
    };
}
exports.makeWSdata = makeWSdata;
exports.markets = [
    'NYS',
    'NAS',
    'AMS',
    'TSE',
    'HKS',
    'SHS',
    'SZS',
    'HSX',
    'HNX',
];
//# sourceMappingURL=KIS.type.js.map