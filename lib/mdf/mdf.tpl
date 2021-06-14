import { core, express } from '@mdfjs/node';
import AppModule from '../{{{ appFile }}}';
{{#useLogger}}
import { WinstonModule, utilities } from 'nest-winston';
import { genHttpFormat, TIMESTAMP_OPTS } from '{{{ formatPath }}}';
import 'winston-daily-rotate-file';
{{/useLogger}}

/**
 * @file 框架生产，禁止修改
 * @todo 待处理：中间件、工具库、监控等
 */

const opts = { cors: true };
{{#useLogger}}
  const winston = require('winston');
  opts.logger = WinstonModule.createLogger({
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
  });
{{/useLogger}}

async function bootstrap() {
  const app = await core.NestFactory.create<express.NestExpressApplication>(AppModule, opts);

  // render
  app.setViewEngine('hbs');
  app.setBaseViewsDir(`${process.cwd()}/views`);

  app.disable('x-powered-by');
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
