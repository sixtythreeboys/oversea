import { resolve } from 'path';
import { dbModel } from './DB.model';
import { readFileSync } from 'fs';

let codeList = null;

export class DBService {
  exe(query: string) {
    return new Promise((resolve, reject) => {
      dbModel.connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
        }
        resolve({ results, fields });
      });
    });
  }
  async getList() {
    if (codeList === null) {
      codeList = readFileSync(
        resolve(__dirname + '/../../../data/code'),
        'utf8',
      )
        .split('\n')
        .map((e) => e.split('\t'));
    }
    return codeList;
  }
}
