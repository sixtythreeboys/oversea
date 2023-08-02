import { HHDFS76200200, HHDFS76240000 } from 'src/KIS/KIS.type';
export declare class KISApiService {
    oauth2Approval(): Promise<import("axios").AxiosResponse<any, any>>;
    HHDFS76200200(params: HHDFS76200200): Promise<{
        data: any;
        cont: string;
    }>;
    HHDFS76240000(params: HHDFS76240000, period: number): Promise<any[]>;
}
