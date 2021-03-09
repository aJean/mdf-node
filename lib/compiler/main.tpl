import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

/**
 * @file 框架生产，禁止修改
 * @todo 待处理：中间件、工具库、监控等
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
