import { Request, Response } from 'express';
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
    handleLog?: (data: any, req: Request, res: Response) => void;
    handleHttpError?: (err: Error, req: Request, res: Response) => void;
    handleException?: (err: Error) => boolean;
};
declare type RedisType = {
    port?: number;
    family: number;
    db: number;
};
declare const _default: {
    env: string;
    appModule: {
        imports: any[];
        providers: any[];
        exports: any[];
        middlewares: any[];
    };
    customHeaders: string[];
    /**
     * 注入环境信息，如果使用 tsc 编译需要自己处理 define
     */
    setProcessEnv(env: string): void;
    getProcessEnv(): any;
    /**
     * header 透传字段
     */
    getCustomHeaders(): any;
    /**
     * 补充 header 透传字段
     */
    addCustomHeaders(...keys: string[]): any;
    /**
     * 从 headers 里提取 log 信息
     */
    getLogTokens(headers: any): string;
    /**
     * 运行时根据环境变量组合 env，提供给 ConfigModule
     */
    genEnvFiles(): string[];
    /**
     * opentracing endpoint 应该放到配置中心里面
     */
    getJaegerEndpoint(): "http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces" | "http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces";
    /**
     * @Singleton 初始化 tracer
     */
    getJaegerTracer(): any;
    /**
     * 要使用 redis 请先安装 ioredis
     */
    getRedis(opts: RedisType): {
        redis: any;
        err: string;
    };
    /**
     * 创建 app module
     */
    createAppModule(target: AppModuleType): any;
    /**
     * 内部使用
     */
    getAppModule(): any;
};
export default _default;
