import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
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
  },
  // {
  //   _id: false, // Disable the default "_id" field
  // },
);

schema.index({ excd: 1, symb: 1 }, { unique: true });

export const ITEM_MAST = mongoose.model('ITEM_MAST', schema);
