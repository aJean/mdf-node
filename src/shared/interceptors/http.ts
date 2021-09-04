import {
  Injectable,
  Inject,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Readable } from 'stream';
import Helper from '../helper';

/**
 * @file 接口数据处理
 */

@Injectable()
export default class HttpInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  /**
   * 拦截器，用于请求配置与返回结果的处理
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    return next.handle().pipe(
      map((result) => {
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const data = result.data;
        
        this.pipeLog(ctx.getRequest());
        switch (result._type) {
          // 模板渲染
          case 'hbs':
            return result;
          // promethus http exporter
          case 'prom':
            res.set({'Content-Type': 'text/plain'});
            return result.data;
          // 静态资源 cors 中转
          case 'pic':
            // 图片下载失败
            if (!(data instanceof Buffer)) {
              return res.end(null);
            }

            const stream = new Readable();
            stream.push(data);
            stream.push(null);
            res.set({
              'Access-Control-Allow-Origin': '*',
              'Content-Type': result.mime,
              'Content-Length': data.length,
            });

            return stream.pipe(res);
          // 标准 mdf server 接口
          default:
            res.set({ 'Content-Type': 'application/json' });

            if (req['__traceSpan__']) {
              req['__traceSpan__'].finish();
              req['__traceSpan__'] = null;
            }

            return Object.assign(data, { from: 'mdf-node' });
        }
      }),
    );
  }

  /**
   * 请求日志
   */
  pipeLog(req: Request): void {
    const { url, headers, method, body } = req;
    const tokens = Helper.getLogTokens(headers);

    this.logger.log(` ${method} ${url} ${tokens} ${JSON.stringify(body)}`);
  }
}
