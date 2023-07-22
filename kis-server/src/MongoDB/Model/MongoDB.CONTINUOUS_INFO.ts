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
  xymd: { type: String, required: true },
  cdate: { type: Date, default: null },
});

schema.index({ excd: 1, symb: 1, xymd: 1 }, { unique: true });

export default mongoose.model('ContinuousInfo', schema);
