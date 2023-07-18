import _CONFIG from '../../config';
import { Queue } from 'src/common/class.queue';

export const CONFIG = _CONFIG.COMMON.delayingQueue;

const queue = new Queue<{
  func: Function;
  resolve: Function;
  reject: Function;
}>();
let timer = null;

async function exec() {
  if (timer !== null) return;
  const list = queue.dequeueList(CONFIG.bufferSize);
  list.forEach(({ func, resolve, reject }) => {
    func()
      .then((e) => {
        resolve(e);
      })
      .catch((e) => {
        reject(e);
      });
  });
  timer = setTimeout(
    (() => {
      timer = null;
      if (queue.isEmpty() === false) {
        exec();
      }
    }).bind(this),
    CONFIG.term,
  );
}

export async function enqueue(func: Function) {
  const ret = new Promise(function (resolve, reject) {
    queue.enqueue({ func, resolve, reject });
  });
  exec();
  return ret;
}

export async function enqueueFront(func: Function) {
  const ret = new Promise(function (resolve, reject) {
    queue.enqueueFront({ func, resolve, reject });
  });
  exec();
  return ret;
}
