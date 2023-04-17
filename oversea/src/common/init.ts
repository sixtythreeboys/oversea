import { init as DBinit } from 'src/DB/DB.service';
import { init as WSinit } from 'src/oversea/KISWS';

export default async function () {
  await DBinit();
  console.log('DB connected');
  // await WSinit();
  // console.log('WS connected');
}
