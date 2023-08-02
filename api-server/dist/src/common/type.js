"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;
        this.rearIndex = 0;
    }
    enqueue(element) {
        this.items[this.rearIndex] = element;
        this.rearIndex++;
    }
    enqueueList(list) {
        list.forEach((e) => this.enqueue(e));
    }
    dequeue() {
        if (this.frontIndex === this.rearIndex) {
            return 'Underflow';
        }
        const removedItem = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return removedItem;
    }
    dequeueList(size) {
        const res = [];
        for (let i = 0; i < size; i++) {
            res.push(this.dequeue());
            if (this.isEmpty())
                break;
        }
        return res;
    }
    front() {
        if (this.frontIndex === this.rearIndex) {
            return 'No elements in Queue';
        }
        return this.items[this.frontIndex];
    }
    isEmpty() {
        return this.frontIndex === this.rearIndex;
    }
    printQueue() {
        let str = '';
        for (let i = this.frontIndex; i < this.rearIndex; i++) {
            str += this.items[i] + ' ';
        }
        return str;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=type.js.map