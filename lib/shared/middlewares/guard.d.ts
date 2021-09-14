import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
/**
 * @file 流量守卫 [中间件 -> 拦截器 -> 路由处理程序 -> 拦截器 -> 异常过滤器]
 */
export default class GuardMiddleware implements NestMiddleware {
    /**
     * 链路生成 span
     */
    use(req: Request, res: Response, next: Function): void;
}
