import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init as COMMON } from './common/init';
import { init as MongoDB } from 'src/MongoDB/MongoDB.service';
import config from 'config';

async function init() {
  const initList = { MongoDB, COMMON };
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
  /*임의실행*/
  /*------*/
  return true;
}

async function bootstrap() {
  await init();
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(config.APP.PORT);
}
bootstrap();
