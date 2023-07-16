import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    rsym: String,
    zdiv: String,
    curr: String,
    vnit: String,
    open: String,
    high: String,
    low: String,
    last: String,
    base: String,
    pvol: String,
    pamt: String,
    uplp: String,
    dnlp: String,
    h52p: String,
    h52d: String,
    l52p: String,
    l52d: String,
    perx: String,
    pbrx: String,
    epsx: String,
    bpsx: String,
    shar: String,
    mcap: String,
    tomv: String,
    t_xprc: String,
    t_xdif: String,
    t_xrat: String,
    p_xprc: String,
    p_xdif: String,
    p_xrat: String,
    t_rate: String,
    p_rate: String,
    t_xsgn: String,
    p_xsng: String,
    e_ordyn: String,
    e_hogau: String,
    e_icod: String,
    e_parp: String,
    tvol: String,
    tamt: String,
    etyp_nm: String,
    updatedTime: {
      type: Date,
      default: new Date(),
    },
  },
  {
    _id: false, // Disable the default "_id" field
  },
);

schema.index({ rsym: 1 }, { unique: true });

export const HHDFS76200200 = mongoose.model('HHDFS76200200', schema);
