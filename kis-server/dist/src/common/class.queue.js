"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class Queue {
    constructor() {
        this.frontNode = null;
        this.rearNode = null;
    }
    enqueue(element) {
        const newNode = new QueueNode(element);
        if (!this.frontNode) {
            this.frontNode = newNode;
            this.rearNode = newNode;
        }
        else {
            if (this.rearNode) {
                this.rearNode.next = newNode;
                this.rearNode = newNode;
            }
        }
    }
    enqueueList(list) {
        list.forEach((e) => this.enqueue(e));
    }
    enqueueFront(element) {
        const newNode = new QueueNode(element);
        if (!this.frontNode) {
            this.frontNode = newNode;
            this.rearNode = newNode;
        }
        else {
            newNode.next = this.frontNode;
            this.frontNode = newNode;
        }
    }
    dequeue() {
        if (!this.frontNode) {
            return 'Underflow';
        }
        const removedItem = this.frontNode.value;
        this.frontNode = this.frontNode.next;
        if (!this.frontNode) {
            this.rearNode = null;
        }
        return removedItem;
    }
    dequeueList(size) {
        const res = [];
        for (let i = 0; i < size; i++) {
            const item = this.dequeue();
            if (typeof item === 'string' && item === 'Underflow') {
                break;
            }
            res.push(item);
        }
        return res;
    }
    front() {
        if (!this.frontNode) {
            return 'No elements in Queue';
        }
        return this.frontNode.value;
    }
    isEmpty() {
        return this.frontNode === null;
    }
    printQueue() {
        let str = '';
        let currentNode = this.frontNode;
        while (currentNode) {
            str += currentNode.value + ' ';
            currentNode = currentNode.next;
        }
        return str;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=class.queue.js.map