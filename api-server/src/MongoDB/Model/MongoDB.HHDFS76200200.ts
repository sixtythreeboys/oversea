import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    rsym: String,
    zdiv: String,
    curr: String,
    vnit: String,
    open: Number, // Convert to Number
    high: Number, // Convert to Number
    low: Number, // Convert to Number
    last: Number, // Convert to Number
    base: Number, // Convert to Number
    pvol: Number, // Convert to Number
    pamt: Number, // Convert to Number
    uplp: Number, // Convert to Number
    dnlp: Number, // Convert to Number
    h52p: Number, // Convert to Number
    h52d: String,
    l52p: Number, // Convert to Number
    l52d: String,
    perx: Number, // Convert to Number
    pbrx: Number, // Convert to Number
    epsx: Number, // Convert to Number
    bpsx: Number, // Convert to Number
    shar: Number, // Convert to Number
    mcap: Number, // Convert to Number
    tomv: Number, // Convert to Number
    t_xprc: Number, // Convert to Number
    t_xdif: Number, // Convert to Number
    t_xrat: Number, // Convert to Number
    p_xprc: Number, // Convert to Number
    p_xdif: Number, // Convert to Number
    p_xrat: Number, // Convert to Number
    t_rate: Number, // Convert to Number
    p_rate: Number, // Convert to Number
    t_xsgn: String,
    p_xsng: String,
    e_ordyn: String,
    e_hogau: Number, // Convert to Number
    e_icod: String,
    e_parp: Number, // Convert to Number
    tvol: Number, // Convert to Number
    tamt: Number, // Convert to Number
    etyp_nm: String,
    knam: String,
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
