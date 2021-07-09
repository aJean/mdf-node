import { ArgumentsHost, LoggerService } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
/**
 * @file 全局异常捕获
 */
export default class ErrorFilter extends BaseExceptionFilter {
    private readonly logger;
    constructor(logger: LoggerService);
    /**
     * http 异常
     */
    catch(err: any, host: ArgumentsHost): void;
    /**
     * 输出异常日志
     */
    pipeLog(request: any, error: Error): void;
}
