export declare const CONFIG: {
    bufferSize: number;
    term: number;
};
export declare function enqueue(func: Function): Promise<unknown>;
export declare function enqueueFront(func: Function): Promise<unknown>;
