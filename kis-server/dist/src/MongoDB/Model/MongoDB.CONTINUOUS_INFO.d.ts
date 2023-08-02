import mongoose from 'mongoose';
export declare const CONTINUOUS_INFO: mongoose.Model<{
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
}> & {
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
}, mongoose.Document<unknown, {}, {
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
}> & {
    excd: string;
    symb: string;
    continuous: number;
    datas: {
        open?: number;
        high?: number;
        low?: number;
        tvol?: number;
        tamt?: number;
        xymd?: string;
        clos?: number;
        sign?: string;
        diff?: number;
        rate?: number;
        pbid?: number;
        vbid?: number;
        pask?: number;
        vask?: number;
    }[];
    htsKorIsnm: string;
    cdate: Date;
} & {
    _id: mongoose.Types.ObjectId;
}>>;
