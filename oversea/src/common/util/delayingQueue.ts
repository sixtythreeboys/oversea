import _CONFIG from '../../../config';
import { Queue } from 'src/common/type';

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
    1000,
  );
}

export async function enqueue(func: Function) {
  const ret = new Promise(function (resolve, reject) {
    queue.enqueue({ func, resolve, reject });
  });
  exec();
  return ret;
}