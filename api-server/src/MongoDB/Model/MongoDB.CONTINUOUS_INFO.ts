import mongoose from 'mongoose';

const schema = new mongoose.Schema({
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

export const CONTINUOUS_INFO = mongoose.model('CONTINUOUS_INFO', schema);
