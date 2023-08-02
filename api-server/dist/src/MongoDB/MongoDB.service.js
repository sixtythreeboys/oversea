"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const MongoDB_model_1 = require("./MongoDB.model");
const config_1 = require("../../config");
async function init() {
    await MongoDB_model_1.dbModel.connection
        .connect(config_1.default.MongoDB.connectString)
        .then(() => console.log('Mongoose Connected'));
    return;
}
exports.init = init;
//# sourceMappingURL=MongoDB.service.js.map