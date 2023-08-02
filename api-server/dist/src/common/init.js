"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const fs_1 = require("fs");
const dateUtils_1 = require("./util/dateUtils");
function logToFile() {
    console.log = new Proxy(console.log, {
        apply: function (target, thisArg, argumentsList) {
            try {
                const logString = `${new Date()}
          ${argumentsList.map((arg) => JSON.stringify(arg, null, 2)).join(' ')}
          `;
                (0, fs_1.appendFileSync)('./log/' + (0, dateUtils_1.getDatestring)() + '.log', logString, 'utf8');
            }
            catch (e) { }
            return target.apply(thisArg, argumentsList);
        },
    });
}
async function init() {
    logToFile();
}
exports.init = init;
//# sourceMappingURL=init.js.map