"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTINUOUS_INFO = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.default.Schema({
    excd: { type: String, required: true },
    symb: { type: String, required: true },
    continuous: { type: Number, default: null },
    datas: [
        {
            xymd: String,
            clos: Number,
            sign: String,
            diff: Number,
            rate: Number,
            open: Number,
            high: Number,
            low: Number,
            tvol: Number,
            tamt: Number,
            pbid: Number,
            vbid: Number,
            pask: Number,
            vask: Number,
        },
    ],
    htsKorIsnm: { type: String, default: null },
    cdate: { type: Date, default: null },
});
schema.index({ excd: 1, symb: 1, cdate: 1 }, { unique: true });
schema.index({ continuous: 1 });
exports.CONTINUOUS_INFO = mongoose_1.default.model('CONTINUOUS_INFO', schema);
//# sourceMappingURL=MongoDB.CONTINUOUS_INFO.js.map