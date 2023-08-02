"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueFront = exports.enqueue = exports.CONFIG = void 0;
const config_1 = require("../../../config");
const class_queue_1 = require("../../common/class.queue");
exports.CONFIG = config_1.default.COMMON.delayingQueue;
const queue = new class_queue_1.Queue();
let timer = null;
async function exec() {
    if (timer !== null)
        return;
    const list = queue.dequeueList(exports.CONFIG.bufferSize);
    list.forEach(({ func, resolve, reject }) => {
        func()
            .then((e) => {
            resolve(e);
        })
            .catch((e) => {
            reject(e);
        });
    });
    timer = setTimeout((() => {
        timer = null;
        if (queue.isEmpty() === false) {
            exec();
        }
    }).bind(this), exports.CONFIG.term);
}
async function enqueue(func) {
    const ret = new Promise(function (resolve, reject) {
        queue.enqueue({ func, resolve, reject });
    });
    exec();
    return ret;
}
exports.enqueue = enqueue;
async function enqueueFront(func) {
    const ret = new Promise(function (resolve, reject) {
        queue.enqueueFront({ func, resolve, reject });
    });
    exec();
    return ret;
}
exports.enqueueFront = enqueueFront;
//# sourceMappingURL=KIS.delayingQueue.js.map