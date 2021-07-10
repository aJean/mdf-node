import { Core, Express, WinstonModule, utilities, Logger, Helper } from '@mdfjs/node';
import { ErrorFilter, HttpInterceptor, GuardMiddleware, SharedModule } from '@mdfjs/node';
import { Global, Module, NestModule, MiddlewareConsumer } from '@mdfjs/node';
{{#useLogger}}
import { Winston } from '@mdfjs/node';
{{/useLogger}}
import AppModule from '../{{{ appFile }}}';

/**
 * @file 框架生产，禁止修改
 */

Helper.setProcessEnv(process.env.MDF_ENV!);

@Global()
@Module({
  imports: [SharedModule.forRoot(), ...AppModule.imports],
  providers: [
    Logger,
    {
      provide: Core.APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: Core.APP_FILTER,
      useClass: ErrorFilter,
    },
    ...AppModule.providers,
  ],
  exports: [SharedModule],
})
class MdfModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(GuardMiddleware).forRoutes('*');
    AppModule.middlewares.forEach((middleware: any) => consumer.apply(middleware.apply).forRoutes(middleware.path));
  }
}

const opts: any = { cors: true };
{{#useLogger}}
  const TIMESTAMP_OPTS = { format: 'YYYY-MM-DD HH:mm:ss' };
  /**
   * 格式化日志输出
   */
  function genHttpFormat(): Winston.Logform.Format {
    return Winston.format.printf((debug) => {
      const { timestamp, level, message, ...args } = debug;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}] - ${message}`;
    });
  }

  try {
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
  } catch(e) {
    // 日志目录初始化异常
    Logger.error(e.message);
  }
{{/useLogger}}

async function bootstrap() {
  const app = await Core.NestFactory.create<Express.NestExpressApplication>(MdfModule, opts);

  // render
  app.setViewEngine('hbs');
  app.setBaseViewsDir(`${process.cwd()}/views`);

  app.disable('x-powered-by');
  await app.listen({{{ port }}});

  console.log('\napp server is listening at localhost:{{{ port }}}');
}

bootstrap();
