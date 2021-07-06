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
import { getLogTokens } from '../utils';

/**
 * @file 全局异常捕获
 */

@Injectable()
@Catch()
export default class ErrorFilter extends BaseExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {
    super();

    process.on('uncaughtException', (e) => {
      this.logger.error(`${e}`);
      // 不是自定义异常就让进程正常退出
      if (!(e instanceof HttpException)) {
        process.exit(1);
      }
    });
  }

  /**
   * just like timeout
   */
  catch(error: Error, host: ArgumentsHost): void {
    super.catch(error, host);

    const ctx = host.switchToHttp();
    this.doLog(ctx.getRequest(), error);
  }

  /**
   * 输出异常日志
   */
  doLog(request: any, error: Error): void {
    const { url, headers, method, body } = request;
    const tokens = getLogTokens(headers);

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
