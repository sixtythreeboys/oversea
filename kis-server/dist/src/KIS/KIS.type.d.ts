export type Markets = 'NYS' | 'NAS' | 'AMS' | 'TSE' | 'HKS' | 'SHS' | 'SZS' | 'HSX' | 'HNX';
export type HHDFS76200200 = {
    AUTH: '';
    EXCD: Markets;
    SYMB: string;
};
export type Header = {
    'content-type'?: string;
    authorization?: string;
    appkey?: string;
    appsecret?: string;
    personalseckey?: string;
    tr_id: string;
    tr_cont?: string;
    custtype?: string;
    seq_no?: string;
    mac_address?: string;
    phone_number?: string;
    ip_addr?: string;
    hashkey?: string;
    gt_uid?: string;
};
export declare function makeHeader(params?: Header): Header;
export declare function makeWSdata(body: any): {
    header: {
        approval_key: any;
        custtype: string;
        tr_type: string;
        'content-type': string;
    };
    body: {
        input: any;
    };
};
export type HHDFS76240000 = {
    AUTH: '';
    EXCD: Markets;
    SYMB: string;
    GUBN: '0' | '1' | '2';
    BYMD: string;
    MODP: '0' | '1';
    KEYB: string;
};
export declare const markets: Markets[];
