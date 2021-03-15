import { NestFactory } from '@nestjs/core';
import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';
import AppModule from './app.module';

/**
 * @file 框架生产，禁止修改
 * @todo 待处理：中间件、工具库、监控等
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        }),
        new winston.transports.File({
          filename: '{{{ envs.NODE_LOG_INFO_PATH }}}',
          level: 'info',
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        }),
        new winston.transports.File({
          filename: '{{{ envs.NODE_LOG_WARN_PATH }}}',
          level: 'warn',
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        }),
        new winston.transports.File({
          filename: '{{{ envs.NODE_LOG_ERR_PATH }}}',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        }),
      ]
    })
  });

  app.enableCors();
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
