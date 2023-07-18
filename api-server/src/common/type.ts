export class Queue<T> {
  private items: T[];
  private frontIndex: number;
  private rearIndex: number;

  constructor() {
    this.items = [];
    this.frontIndex = 0;
    this.rearIndex = 0;
  }

  enqueue(element: T): void {
    this.items[this.rearIndex] = element;
    this.rearIndex++;
  }
  enqueueList(list: T[]) {
    list.forEach((e) => this.enqueue(e));
  }
  dequeue(): T | string {
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
      if (this.isEmpty()) break;
    }
    return res;
  }

  front(): T | string {
    if (this.frontIndex === this.rearIndex) {
      return 'No elements in Queue';
    }
    return this.items[this.frontIndex];
  }

  isEmpty(): boolean {
    return this.frontIndex === this.rearIndex;
  }

  printQueue(): string {
    let str = '';
    for (let i = this.frontIndex; i < this.rearIndex; i++) {
      str += this.items[i] + ' ';
    }
    return str;
  }
}
