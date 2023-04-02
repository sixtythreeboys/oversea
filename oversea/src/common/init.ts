import { init } from 'src/DB/DB.service';

export default async function () {
  await init();
}
