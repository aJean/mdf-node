"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jaegerClient = _interopRequireDefault(require("jaeger-client"));

var _common = require("@nestjs/common");

var _utils = require("@mdfjs/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  env: 'prod',
  // 应用模块装载记录
  appModule: {
    imports: [],
    providers: [],
    exports: [],
    middlewares: []
  },
  // 自定义 http headers
  customHeaders: ['authorization', 'taltoken', 'user-agent', 'clientid'],

  /**
   * 注入环境信息，如果使用 tsc 编译需要自己处理 define
   */
  setProcessEnv(env) {
    this.env = env;
  },

  getProcessEnv() {
    return this.env;
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
  addCustomHeaders(...keys) {
    this.customHeaders.push(...keys);
    return this.getCustomHeaders();
  },

  /**
   * 从 headers 里提取 log 信息
   */
  getLogTokens(headers) {
    const tokens = this.getCustomHeaders().map(key => headers[key] || 'null').join('-');
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
    return this.getProcessEnv() === 'prod' ? 'http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces' : 'http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces';
  },

  /**
   * 初始化 tracer
   */
  getJaegerTracer() {
    return _jaegerClient.default.initTracer({
      serviceName: '101-bff',
      sampler: {
        type: 'const',
        param: 1
      },
      reporter: {
        collectorEndpoint: this.getJaegerEndpoint()
      }
    }, {
      tags: {
        '101-bff.version': (0, _utils.getUserPkg)(process.cwd(), 'version') || '0.0.0'
      }
    });
  },

  /**
   * 要使用 redis 请先安装 ioredis
   */
  getRedis(opts) {
    const _opts$port = opts.port,
          port = _opts$port === void 0 ? 6379 : _opts$port,
          family = opts.family,
          db = opts.db; // @ts-ignore

    const host = this.configService.get('REDIS_HOST');

    const ioredis = require('ioredis');

    const redis = new ioredis({
      port,
      host,
      family,
      db,
      lazyConnect: true
    });
    redis.on('error', e => {
      redis.disconnect();
      const error = {};
      Error.captureStackTrace(error);
      throw new _common.ServiceUnavailableException(`redis ${e.message} ${error.stack}`);
    });
    return {
      redis,
      err: 'not support yet'
    };
  },

  /**
   * 创建 app module
   */
  createAppModule(target) {
    const module = Object.assign(this.appModule, target);
    this.appModule = module;
    return module;
  },

  /**
   * 内部使用
   */
  getAppModule() {
    return this.appModule;
  }

};
exports.default = _default;