import { Injectable, NestMiddleware, HttpService } from '@nestjs/common';
import { Request, Response } from 'express';
import * as opentracing from 'opentracing';
import { getJaegerTracer } from '../utils';

/**
 * @file 流量守卫
 *       中间件 -> 拦截器 -> 路由处理程序 -> 拦截器 -> 异常过滤器
 */

const tracer = getJaegerTracer();

@Injectable()
export default class GuardMiddleware implements NestMiddleware {
  span: opentracing.Span | undefined;

  constructor(private httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(config => {
      // controller -> service 是同步的
      if (this.span) {
        const span = this.span;
        span.tracer().inject(span.context(), opentracing.FORMAT_HTTP_HEADERS, config.headers);
      }

      return config;
    });
  }

  use(req: Request, res: Response, next: Function) {
    const span = (this.span = tracer.startSpan(req.baseUrl));
    req['__traceSpan__'] = span;

    span.log({
      time: Date.now(),
      query: req.query,
      body: req.body,
    });

    next();
  }
}
