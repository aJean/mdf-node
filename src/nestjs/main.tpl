import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule, utilities } from 'nest-winston';
import AppModule from './app.module';
import { genHttpFormat, TIMESTAMP_OPTS } from '{{{ formatPath }}}';
import 'winston-daily-rotate-file';

/**
 * @file 框架生产，禁止修改
 * @todo 待处理：中间件、工具库、监控等
 */

const winston = require('winston');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
        }),
        new winston.transports.DailyRotateFile({
          datePattern: 'YYYY-MM-DD-HH',
          filename: '{{{ envs.NODE_LOG_INFO_PATH }}}/%DATE%.log',
          level: 'info',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
        }),
        new winston.transports.DailyRotateFile({
          datePattern: 'YYYY-MM-DD-HH',
          filename: '{{{ envs.NODE_LOG_ERR_PATH }}}/%DATE%_error.log',
          level: 'error',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
        }),
      ]
    })
  });

  app.disable('x-powered-by');
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
