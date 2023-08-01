import { Eureka } from 'eureka-js-client';
import config from '../../config';

export function apply() {
  async function start() {
    try {
      client.start();
    } catch (e) {
      console.log(e);
    }
  }
  const client = new Eureka(config.EUREKA);
  client.on('deregistered', (e) => {
    start();
  });
  process.on('SIGINT', () => {
    client.stop(() => {
      console.log('Node.js app unregistered from Eureka server');
      process.exit();
    });
  });
  start();
}
