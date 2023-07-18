class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Queue<T> {
  private frontNode: QueueNode<T> | null;
  private rearNode: QueueNode<T> | null;

  constructor() {
    this.frontNode = null;
    this.rearNode = null;
  }

  enqueue(element: T): void {
    const newNode = new QueueNode(element);
    if (!this.frontNode) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else {
      if (this.rearNode) {
        this.rearNode.next = newNode;
        this.rearNode = newNode;
      }
    }
  }

  enqueueList(list: T[]) {
    list.forEach((e) => this.enqueue(e));
  }

  enqueueFront(element: T): void {
    const newNode = new QueueNode(element);
    if (!this.frontNode) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else {
      newNode.next = this.frontNode;
      this.frontNode = newNode;
    }
  }

  dequeue(): T | string {
    if (!this.frontNode) {
      return 'Underflow';
    }
    const removedItem = this.frontNode.value;
    this.frontNode = this.frontNode.next;
    if (!this.frontNode) {
      this.rearNode = null; // The queue is empty, so set rearNode to null.
    }
    return removedItem;
  }

  dequeueList(size: number) {
    const res = [];
    for (let i = 0; i < size; i++) {
      const item = this.dequeue();
      if (typeof item === 'string' && item === 'Underflow') {
        break; // Exit loop if there are no more elements in the queue.
      }
      res.push(item);
    }
    return res;
  }

  front(): T | string {
    if (!this.frontNode) {
      return 'No elements in Queue';
    }
    return this.frontNode.value;
  }

  isEmpty(): boolean {
    return this.frontNode === null;
  }

  printQueue(): string {
    let str = '';
    let currentNode = this.frontNode;
    while (currentNode) {
      str += currentNode.value + ' ';
      currentNode = currentNode.next;
    }
    return str;
  }
}
