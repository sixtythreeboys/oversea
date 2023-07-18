import { dbModel } from './MongoDB.model';
import CONFIG from 'config';
export async function init() {
  await dbModel.connection
    .connect(CONFIG.MongoDB.connectString)
    .then(() => console.log('Mongoose Connected'));
  return;
}
