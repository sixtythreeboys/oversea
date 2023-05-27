import { createConnection } from 'mysql';
import CONFIG from '../../config';

export const dbModel = {
  connection: createConnection(CONFIG.MYSQL),
};
