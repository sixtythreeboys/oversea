import { OverseaService } from './oversea.service';
import { Response } from 'express';
export declare class OverseaController {
    private readonly oversea;
    constructor(oversea: OverseaService);
    test(res: Response, params: any): Promise<void>;
    list(res: Response, period: string, avlsScal: string): Promise<void>;
    detail(res: Response, EXCD: string, 종목코드: string, 기간분류코드: string, period: string | number): Promise<void>;
}
