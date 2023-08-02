declare const _default: {
    APP: {
        PORT: string;
    };
    COMMON: {
        delayingQueue: {
            bufferSize: number;
            term: number;
        };
    };
    KIS: {
        real: string;
        urls: {
            해외결제일자조회: {
                path: string;
                tr_id: string;
            };
            해외주식_현재가상세: {
                path: string;
                tr_id: string;
            };
            해외주식_기간별시세: {
                path: string;
                tr_id: string;
                defaultLength: number;
            };
            접근토큰발급: {
                path: string;
            };
            접근토큰폐기: {
                path: string;
            };
        };
        appkey: string;
        appsecret: string;
        hashkey: any;
    };
    KIS_WS: {
        real: string;
        urls: {
            해외주식_실시간지연체결가: {
                path: string;
                tr_id: string;
            };
        };
    };
    MongoDB: {
        connectString: string;
    };
    Batch: {
        BufferSize: number;
    };
};
export default _default;
