import { NestInterceptor, ExecutionContext, CallHandler, LoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
/**
 * @file 接口数据处理
 */
export default class HttpInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: LoggerService);
    /**
     * 拦截器，用于请求配置与返回结果的处理
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    /**
     * 请求日志
     */
    doLog(req: Request): void;
}
