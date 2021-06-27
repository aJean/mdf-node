import { Core, Express, WinstonModule, utilities } from '@mdfjs/node';
{{#useLogger}}
import { Winston, Helper } from '@mdfjs/node';
{{/useLogger}}
import AppModule from '../{{{ appFile }}}';

/**
 * @file 框架生产，禁止修改
 * @todo 待处理：中间件、工具库、监控等
 */

const opts: any = { cors: true };
{{#useLogger}}
  const { genHttpFormat, TIMESTAMP_OPTS } = Helper;

  opts.logger = WinstonModule.createLogger({
    transports: [
      new Winston.transports.Console({
        format: Winston.format.combine(Winston.format.timestamp(), utilities.format.nestLike()),
      }),
      new Winston.transports.DailyRotateFile({
        datePattern: 'YYYY-MM-DD-HH',
        filename: '{{{ envs.NODE_LOG_INFO_PATH }}}/%DATE%.log',
        level: 'info',
        maxFiles: '14d',
        format: Winston.format.combine(Winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
      }),
      new Winston.transports.DailyRotateFile({
        datePattern: 'YYYY-MM-DD-HH',
        filename: '{{{ envs.NODE_LOG_ERR_PATH }}}/%DATE%_error.log',
        level: 'error',
        maxFiles: '14d',
        format: Winston.format.combine(Winston.format.timestamp(TIMESTAMP_OPTS), genHttpFormat()),
      }),
    ]
  });
{{/useLogger}}

async function bootstrap() {
  const app = await Core.NestFactory.create<Express.NestExpressApplication>(AppModule, opts);

  // render
  app.setViewEngine('hbs');
  app.setBaseViewsDir(`${process.cwd()}/views`);

  app.disable('x-powered-by');
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
