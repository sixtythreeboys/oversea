import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apply as EUREKA } from '../src/eureka/eureka';
import { init as MongoDB } from 'src/MongoDB/MongoDB.service';
import { init as COMMON } from './common/init';
//import { init as KISWS } from 'src/KIS/KISWS';
import config from 'config';

async function init() {
  const initList = { MongoDB, COMMON, EUREKA };
  await Promise.all(
    Object.keys(initList).map(async (service) => {
      try {
        await initList[service]();
        console.log(`service inited : ${service}`);
      } catch (e) {
        console.log(`service init failed : ${service}`);
        console.log(e);
      }

      return true;
    }),
  );
  return true;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await init();
  await app.listen(config.APP.PORT);
}
bootstrap();
