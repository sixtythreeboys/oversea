import { BatchUpdateContinuous } from './Batch.updateContinuous';
export declare class BatchService {
    private readonly batchUpdateContinuous;
    private job;
    onDoing: boolean;
    constructor(batchUpdateContinuous: BatchUpdateContinuous);
    moduleInit(): Promise<void>;
    batchBundle(): Promise<void>;
}
