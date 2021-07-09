import {
  Catch,
  ArgumentsHost,
  Injectable,
  Inject,
  Logger,
  LoggerService,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import Helper from '../helper';

/**
 * @file 全局异常捕获
 */

@Injectable()
@Catch()
export default class ErrorFilter extends BaseExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {
    super();

    const module = Helper.getAppModule();
    // 应用异常
    process.on('uncaughtException', (e) => {
      const isHttpExcept = e instanceof HttpException;
      const handleException = module.handleException;

      this.logger.error(`${e}`);
      // 用户处理函数返回 true
      if (handleException && handleException(e)) {
        process.exit(1);
      }
      // 非 http 异常，比如 redis ServiceUnavailableException 就可以不用退出
      if (!handleException && isHttpExcept) {
        process.exit(1);
      }
    });
  }

  /**
   * http 异常
   */
  catch(err: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { handleHttpError } = Helper.getAppModule();

    handleHttpError
      ? handleHttpError(err, ctx.getRequest(), ctx.getResponse())
      : super.catch(err, host);
    this.pipeLog(ctx.getRequest(), err);
  }

  /**
   * 输出异常日志
   */
  pipeLog(request: any, error: Error): void {
    const { url, headers, method, body } = request;
    const tokens = Helper.getLogTokens(headers);

    if (request['__traceSpan__']) {
      const span = request['__traceSpan__'];
      const tid = span.context().toTraceId();

      span.setTag('error', true).finish();
      request['__traceSpan__'] = null;

      // 输出 traceId，格式还是需要规范避免影响 log store
      return this.logger.error(
        `${method} ${url} ${tid} ${tokens} ${JSON.stringify(body)} ${error.stack}`,
      );
    }

    this.logger.error(`${method} ${url} ${tokens} ${JSON.stringify(body)} ${error.stack}`);
  }
}
