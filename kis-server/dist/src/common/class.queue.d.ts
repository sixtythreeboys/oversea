export declare class Queue<T> {
    private frontNode;
    private rearNode;
    constructor();
    enqueue(element: T): void;
    enqueueList(list: T[]): void;
    enqueueFront(element: T): void;
    dequeue(): T | string;
    dequeueList(size: number): any[];
    front(): T | string;
    isEmpty(): boolean;
    printQueue(): string;
}
