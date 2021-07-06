import { NestMiddleware, HttpService } from '@nestjs/common';
import { Request, Response } from 'express';
import * as opentracing from 'opentracing';
export default class GuardMiddleware implements NestMiddleware {
    private httpService;
    span: opentracing.Span | undefined;
    constructor(httpService: HttpService);
    use(req: Request, res: Response, next: Function): void;
}
