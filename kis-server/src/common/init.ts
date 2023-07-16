import { appendFileSync } from 'fs';
import { getToday } from './util/dateUtils';

function logToFile() {
  console.log = new Proxy(console.log, {
    apply: function (target, thisArg, argumentsList) {
      try {
        const logString = `${new Date()}
          ${argumentsList.map((arg) => JSON.stringify(arg, null, 2)).join(' ')}
          `;
        appendFileSync('./log/' + getToday() + '.log', logString, 'utf8');
      } catch (e) {}
      return target.apply(thisArg, argumentsList);
    },
  });
}

export async function init() {
  logToFile();
}
