import { dbModel } from './DB.model';

export async function init() {
  await dbModel.connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database: ' + error.stack);
      return;
    }
    console.log(
      'Connected to MySQL database with connection ID ' +
        dbModel.connection.threadId,
    );
  });
  return;
}

export async function exeQuery(query: string) {
  return new Promise((resolve, reject) => {
    dbModel.connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
}
