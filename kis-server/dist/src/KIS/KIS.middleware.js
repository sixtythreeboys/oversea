"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokenMiddleware = exports.updateToken = void 0;
const axios_1 = require("axios");
const config_1 = require("../../config");
const KIS_model_1 = require("./KIS.model");
async function updateToken() {
    const res = await (0, axios_1.default)({
        method: 'post',
        url: `${config_1.default.KIS.real}${config_1.default.KIS.urls.접근토큰발급.path}`,
        headers: { 'content-type': 'application/json' },
        data: {
            grant_type: 'client_credentials',
            appkey: config_1.default.KIS.appkey,
            appsecret: config_1.default.KIS.appsecret,
        },
    });
    const [Y, M, D, h, m, s] = res.data.access_token_token_expired.split(/[- :]/);
    res.data.access_token_token_expired = new Date(Y, M - 1, D, h, m, s);
    KIS_model_1.default.token = res.data;
}
exports.updateToken = updateToken;
async function checkTokenMiddleware() {
    if (KIS_model_1.default.token.access_token_token_expired <= new Date())
        await updateToken();
}
exports.checkTokenMiddleware = checkTokenMiddleware;
//# sourceMappingURL=KIS.middleware.js.map