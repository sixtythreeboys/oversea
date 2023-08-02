"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_MAST = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.default.Schema({
    ncod: String,
    exid: String,
    excd: String,
    exnm: String,
    symb: String,
    rsym: String,
    knam: String,
    enam: String,
    stis: String,
    curr: String,
    zdiv: String,
    ztyp: String,
    base: String,
    bnit: String,
    anit: String,
    mstm: String,
    metm: String,
    isdr: String,
    drcd: String,
    icod: String,
    sjong: String,
    ttyp: String,
    etyp: String,
    ttyp_sb: String,
});
schema.index({ excd: 1, symb: 1 }, { unique: true });
exports.ITEM_MAST = mongoose_1.default.model('ITEM_MAST', schema);
//# sourceMappingURL=MongoDB.ITEM_MAST.js.map