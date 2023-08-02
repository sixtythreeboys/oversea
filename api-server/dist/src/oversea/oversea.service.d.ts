import { ApiService } from 'src/KISserver/KISserver.apis';
export declare class OverseaService {
    private readonly apiService;
    constructor(apiService: ApiService);
    list({ period, avlsScal }: {
        period: any;
        avlsScal: any;
    }): Promise<any[]>;
    getDetail({ EXCD, 종목코드, 기간분류코드, period }: {
        EXCD: any;
        종목코드: any;
        기간분류코드: any;
        period: any;
    }): Promise<any>;
}
