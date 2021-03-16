import { NestFactory } from '@nestjs/core';
import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';
import AppModule from './app.module';
import { genHttpFormat, TIMESTAMP_OPTS } from '{{{ formatPath }}}';

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
        new winston.transports.DailyRotateFile({
          datePattern: 'YYYY-MM-DD-HH',
          filename: '{{{ envs.NODE_LOG_INFO_PATH }}}/info_%DATE%.log',
          level: 'info',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
        }),
        new winston.transports.DailyRotateFile({
          datePattern: 'YYYY-MM-DD-HH',
          filename: '{{{ envs.NODE_LOG_WARN_PATH }}}/warn_%DATE%.log',
          level: 'warn',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
        }),
        new winston.transports.DailyRotateFile({
          datePattern: 'YYYY-MM-DD-HH',
          filename: '{{{ envs.NODE_LOG_ERR_PATH }}}/error_%DATE%.log',
          level: 'error',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
        }),
      ]
    })
  });

  app.enableCors();
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
