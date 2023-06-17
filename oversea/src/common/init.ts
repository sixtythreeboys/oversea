import { appendFileSync } from "fs";
import { getToday } from "./util/dateUtils";


function logToFile(){
    console.log = new Proxy(console.log, {
        apply: function(target, thisArg, argumentsList) {
          const logString = argumentsList.map(arg => String(arg)).join(' ')+'\n';
          appendFileSync('./log/'+getToday()+'.log', logString,'utf8');
          return target.apply(thisArg, argumentsList);
        }
      });
}

export async function init(){
    logToFile();
}

