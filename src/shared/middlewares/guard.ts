import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import Helper from '../helper';

/**
 * @file 流量守卫 [中间件 -> 拦截器 -> 路由处理程序 -> 拦截器 -> 异常过滤器]
 */

@Injectable()
export default class GuardMiddleware implements NestMiddleware {
  /**
   * 链路生成 span
   */
  use(req: Request, res: Response, next: Function) {
    const tracer = Helper.getJaegerTracer();
    const span = tracer.startSpan(req.baseUrl);
    // @ts-ignore
    req['__traceSpan__'] = req.headers['__traceSpan__'] = span;
    span.log({
      time: Date.now(),
      query: req.query,
      body: req.body,
    });

    next();
  }
}
