"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const MongoDB_ITEM_MAST_1 = require("./Model/MongoDB.ITEM_MAST");
const MongoDB_model_1 = require("./MongoDB.model");
const config_1 = require("../../config");
const KIS_model_1 = require("../KIS/KIS.model");
async function init() {
    await MongoDB_model_1.dbModel.connection
        .connect(config_1.default.MongoDB.connectString)
        .then(() => console.log('Mongoose Connected'));
    KIS_model_1.default.knamMap = await MongoDB_ITEM_MAST_1.ITEM_MAST.find().then((dataList) => Object.fromEntries(dataList.map((e) => [`D${e.excd}${e.symb}`, e.knam])));
    return;
}
exports.init = init;
//# sourceMappingURL=MongoDB.service.js.map