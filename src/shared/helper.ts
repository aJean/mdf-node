import { ServiceUnavailableException } from '@nestjs/common';
import jaeger from 'jaeger-client';

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
};

export default {
  getProcessEnv() {
    return process.env.MDF_ENV;
  },

  /**
   * header 中约定的字段
   */
  getHeaderKeys() {
    return ['authorization', 'taltoken', 'user-agent', 'clientid'].slice(0);
  },

  /**
   * 从 headers 里提取 log 信息
   */
  getLogTokens(headers: any) {
    const tokens = this.getHeaderKeys()
      .map((key: string) => headers[key] || 'null')
      .join('-');
    return `[${tokens}]`;
  },

  /**
   * 运行时根据环境变量组合 env，提供给 ConfigModule
   * TODO: env 相关应该在编译时处理，ConfigModule 只负责分发配置
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
          '101-bff.version': '0.0.1',
        },
      },
    );
  },

  /**
   * 要使用 redis 请先安装 ioredis
   */
  getRedis() {
    const ioredis = require('ioredis');
    const redis = new ioredis({
      port: 6379,
      // @ts-ignore
      host: this.configService.get('REDIS_HOST'),
      family: 4,
      db: 4,
      lazyConnect: true,
    });

    redis.on('error', (e: any) => {
      redis.disconnect();

      const error: any = {};
      Error.captureStackTrace(error);
      throw new ServiceUnavailableException(`redis ${e.message} ${error.stack}`);
    });

    return redis;
  },

  /**
   * 创建 app moudle
   */
  createAppModule(module: AppModuleType) {
    return Object.assign({ imports: [], providers: [], exports: [], middlewares: [] }, module);
  },
};
