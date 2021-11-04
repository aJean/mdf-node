import { ArgumentsHost, LoggerService } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
/**
 * @file 全局异常捕获
 */
export default class ErrorFilter extends BaseExceptionFilter {
    private readonly logger;
    constructor(logger: LoggerService);
    /**
     * 异常返回
     */
    handleError(err: any, req: any, res: any): void;
    /**
     * code 状态码
     */
    genStatus(data: any): any;
    /**
     * 异常捕获
     */
    catch(err: any, host: ArgumentsHost): void;
    /**
     * 异常日志
     */
    pipeLog(request: any, error: Error): void;
    /**
     * 分析日志类型
     */
    print(meta: string, err: any): void;
}
