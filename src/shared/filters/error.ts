import {
  Catch,
  ArgumentsHost,
  Injectable,
  Inject,
  Logger,
  LoggerService,
  ServiceUnavailableException,
  NotFoundException,
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
      const isSueExcept = e instanceof ServiceUnavailableException;
      const handleException = module.handleException;

      this.logger.error(`${e}`);
      // 用户处理函数返回 true
      if ((handleException && handleException(e)) || !isSueExcept) {
        process.exit(1);
      }
    });
  }

  /**
   * 异常返回
   */
  handleError(err: any, req: any, res: any) {
    res.send({
      code: this.genStatus(err.response),
      msg: err.message,
      from: 'mdf-node',
    });
  }

  /**
   * code 状态码
   */
  genStatus(data: any) {
    return data ? data.statusCode : 500;
  }

  /**
   * 异常捕获
   */
  catch(err: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { handleHttpError = this.handleError } = Helper.getAppModule();

    handleHttpError(err, ctx.getRequest(), ctx.getResponse());
    // super.catch(err, host)
    this.pipeLog(ctx.getRequest(), err);
  }

  /**
   * 异常日志
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
      this.print(`${method} ${url} ${tid} ${tokens} ${JSON.stringify(body)}`, error);
    } else {
      this.print(`${method} ${url} ${tokens} ${JSON.stringify(body)}`, error);
    }
  }

  /**
   * 分析日志类型
   */
  print(meta: string, err: any) {
    const res = err.response;
    const msg = `${this.genStatus(res)} ${err.message}`;

    // axios error 一般都是 rpc error
    if (err.isAxiosError) {
      const config = res.config;
      const trace = `From: ${meta} \nTo: ${config.method.toUpperCase()} ${config.url.trim()} ${JSON.stringify(
        config.data,
      )}`;

      this.logger.error(msg, trace, 'ErrorFilter');
    } else if (err instanceof NotFoundException) {
      // 访问不存在的接口，输出 warning 就可以了
      this.logger.warn(msg, 'ErrorFilter');
    } else {
      // 代码异常
      this.logger.error(msg, err.stack, 'ErrorFilter');
    }
  }
}
