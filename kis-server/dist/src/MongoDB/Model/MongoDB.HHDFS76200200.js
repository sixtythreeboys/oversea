"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HHDFS76200200 = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.default.Schema({
    rsym: String,
    zdiv: String,
    curr: String,
    vnit: String,
    open: Number,
    high: Number,
    low: Number,
    last: Number,
    base: Number,
    pvol: Number,
    pamt: Number,
    uplp: Number,
    dnlp: Number,
    h52p: Number,
    h52d: String,
    l52p: Number,
    l52d: String,
    perx: Number,
    pbrx: Number,
    epsx: Number,
    bpsx: Number,
    shar: Number,
    mcap: Number,
    tomv: Number,
    t_xprc: Number,
    t_xdif: Number,
    t_xrat: Number,
    p_xprc: Number,
    p_xdif: Number,
    p_xrat: Number,
    t_rate: Number,
    p_rate: Number,
    t_xsgn: String,
    p_xsng: String,
    e_ordyn: String,
    e_hogau: Number,
    e_icod: String,
    e_parp: Number,
    tvol: Number,
    tamt: Number,
    etyp_nm: String,
    knam: String,
    updatedTime: {
        type: Date,
        default: new Date(),
    },
}, {
    _id: false,
});
schema.index({ rsym: 1 }, { unique: true });
exports.HHDFS76200200 = mongoose_1.default.model('HHDFS76200200', schema);
//# sourceMappingURL=MongoDB.HHDFS76200200.js.map