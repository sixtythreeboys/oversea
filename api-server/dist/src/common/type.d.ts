export declare class Queue<T> {
    private items;
    private frontIndex;
    private rearIndex;
    constructor();
    enqueue(element: T): void;
    enqueueList(list: T[]): void;
    dequeue(): T | string;
    dequeueList(size: any): any[];
    front(): T | string;
    isEmpty(): boolean;
    printQueue(): string;
}
