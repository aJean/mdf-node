import jaeger from 'jaeger-client';
/**
 * @file utils
 */
export declare function getProcessEnv(): string;
/**
 * header 中约定的字段
 */
export declare function getHeaderKeys(): string[];
/**
 * 从 headers 里提取 log 信息
 */
export declare function getLogTokens(headers: any): string;
/**
 * 运行时根据环境变量组合 env，提供给 ConfigModule
 * TODO: env 相关应该在编译时处理，ConfigModule 只负责分发配置
 */
export declare function genEnvFiles(): string[];
/**
 * opentracing endpoint 应该放到配置中心里面
 */
export declare function getJaegerEndpoint(): "http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces" | "http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces";
/**
 * 初始化 tracer
 */
export declare function getJaegerTracer(): jaeger.JaegerTracer;
/**
 * 要使用 redis 请先安装 ioredis
 */
export declare function getRedis(): any;
