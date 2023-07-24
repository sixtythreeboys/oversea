import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  excd: { type: String, required: true },
  symb: { type: String, required: true },
  continuous: { type: Number, default: null },
  stckClpr: { type: Number, default: null },
  prdyAvlsScal: { type: Number, default: null },
  prdyCtrt: { type: Number, default: null },
  totalCtrt: { type: Number, default: null },
  htsKorIsnm: { type: String, default: null },
  cdate: { type: Date, default: null },
});

schema.index({ excd: 1, symb: 1, cdate: 1 }, { unique: true });
schema.index({ continuous: 1 });

export const CONTINUOUS_INFO = mongoose.model('CONTINUOUS_INFO', schema);
