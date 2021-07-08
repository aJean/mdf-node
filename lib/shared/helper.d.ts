import jaeger from 'jaeger-client';
/**
 * @file 共享包 helper
 */
declare type Middlewares = {
    path: string;
    apply: Function;
};
declare type AppModuleType = {
    imports?: any[];
    providers?: any[];
    exports?: any[];
    middlewares?: Middlewares[];
};
declare const _default: {
    getProcessEnv(): string;
    /**
     * header 中约定的字段
     */
    getHeaderKeys(): string[];
    /**
     * 从 headers 里提取 log 信息
     */
    getLogTokens(headers: any): string;
    /**
     * 运行时根据环境变量组合 env，提供给 ConfigModule
     * TODO: env 相关应该在编译时处理，ConfigModule 只负责分发配置
     */
    genEnvFiles(): string[];
    /**
     * opentracing endpoint 应该放到配置中心里面
     */
    getJaegerEndpoint(): "http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces" | "http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces";
    /**
     * 初始化 tracer
     */
    getJaegerTracer(): jaeger.JaegerTracer;
    /**
     * 要使用 redis 请先安装 ioredis
     */
    getRedis(): any;
    /**
     * 创建 app moudle
     */
    createAppModule(module: AppModuleType): {
        imports: any[];
        providers: any[];
        exports: any[];
        middlewares: any[];
    } & AppModuleType;
};
export default _default;
