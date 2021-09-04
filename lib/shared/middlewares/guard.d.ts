import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export default class GuardMiddleware implements NestMiddleware {
    /**
     * 链路生成 span
     */
    use(req: Request, res: Response, next: Function): void;
}
