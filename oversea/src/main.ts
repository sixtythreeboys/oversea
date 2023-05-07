import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apply as eureka } from './common/eureka';
import config from 'config';

import { init as DBinit } from 'src/DB/DB.service';
import { init as KISWSinit } from 'src/oversea/KISWS';

async function init() {
  try {
    await DBinit();
    console.log('DB connected');
  } catch (e) {
    console.log('DB connect failed');
  }
  try {
    await KISWSinit();
    console.log('KISWS connected');
  } catch (e) {
    console.log('KISWS connect failed');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init();
  await app.listen(config.APP.PORT);
  //eureka();
}
bootstrap();
