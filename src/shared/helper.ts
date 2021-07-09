import jaeger from 'jaeger-client';
import { ServiceUnavailableException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getUserPkg } from '@mdfjs/utils';

/**
 * @file 共享包 helper
 */

type Middlewares = {
  path: string;
  apply: Function;
};

type AppModuleType = {
  imports?: any[];
  providers?: any[];
  exports?: any[];
  middlewares?: Middlewares[];
  handleHttpError?: (err: Error, req: Request, res: Response) => void;
  handleException?: (err: Error) => boolean;
};

type RedisType = {
  port?: number;
  family: number;
  db: number;
};

export default {
  // 应用模块装载记录
  appModule: { imports: [], providers: [], exports: [], middlewares: [] },
  // 自定义 http headers
  customHeaders: ['authorization', 'taltoken', 'user-agent', 'clientid'],

  /**
   * 注入环境信息，如果使用 tsc 编译需要自己处理 define
   */
  getProcessEnv() {
    return process.env.MDF_ENV;
  },

  /**
   * header 透传字段
   */
  getCustomHeaders() {
    return this.customHeaders.slice(0);
  },

  /**
   * 补充 header 透传字段
   */
  addCustomHeaders(...keys: string[]) {
    this.customHeaders.push(...keys);
    return this.getCustomHeaders();
  },

  /**
   * 从 headers 里提取 log 信息
   */
  getLogTokens(headers: any) {
    const tokens = this.getCustomHeaders()
      .map((key: string) => headers[key] || 'null')
      .join('-');
    return `[${tokens}]`;
  },

  /**
   * 运行时根据环境变量组合 env，提供给 ConfigModule
   */
  genEnvFiles() {
    const env = this.getProcessEnv();
    return ['config/.env.local', `config/.env.${env}`, 'config/.env'];
  },

  /**
   * opentracing endpoint 应该放到配置中心里面
   */
  getJaegerEndpoint() {
    return this.getProcessEnv() === 'prod'
      ? 'http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces'
      : 'http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces';
  },

  /**
   * 初始化 tracer
   */
  getJaegerTracer() {
    return jaeger.initTracer(
      {
        serviceName: '101-bff',
        sampler: { type: 'const', param: 1 },
        reporter: { collectorEndpoint: this.getJaegerEndpoint() },
      },
      {
        tags: {
          '101-bff.version': getUserPkg(process.cwd(), 'version') || '0.0.0',
        },
      },
    );
  },

  /**
   * 要使用 redis 请先安装 ioredis
   */
  getRedis(opts: RedisType) {
    const { port = 6379, family, db } = opts;
    // @ts-ignore
    const host = this.configService.get('REDIS_HOST');
    const ioredis = require('ioredis');
    const redis = new ioredis({ port, host, family, db, lazyConnect: true });

    redis.on('error', (e: any) => {
      redis.disconnect();

      const error: any = {};
      Error.captureStackTrace(error);
      throw new ServiceUnavailableException(`redis ${e.message} ${error.stack}`);
    });

    return { redis, err: 'not support yet' };
  },

  /**
   * 创建 app module
   */
  createAppModule(target: AppModuleType) {
    const module = Object.assign(this.appModule, target);
    this.appModule = module;

    return module;
  },

  /**
   * 内部使用
   */
  getAppModule() {
    return this.appModule;
  },
};
