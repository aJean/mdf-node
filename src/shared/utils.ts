import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * @file utils
 */

export function getProcessEnv() {
  return process.env.MDF_ENV;
}

/**
 * header 中约定的字段
 */
export function getHeaderKeys() {
  return ['authorization', 'taltoken', 'user-agent', 'clientid'].slice(0);
}

/**
 * 从 headers 里提取 log 信息
 */
export function getLogTokens(headers: any) {
  const tokens = getHeaderKeys()
    .map((key: string) => headers[key] || 'null')
    .join('-');
  return `[${tokens}]`;
}

/**
 * 运行时根据环境变量组合 env，提供给 ConfigModule
 * TODO: env 相关应该在编译时处理，ConfigModule 只负责分发配置
 */
export function genEnvFiles() {
  const env = getProcessEnv();
  return ['config/.env.local', `config/.env.${env}`, 'config/.env'];
}

/**
 * 模拟 observerable
 */
export function mockResponse(data: any, status?: number, msg: string = '') {
  return from([{ data: { code: status === undefined ? 200 : status, msg, data } }]);
}

/**
 * opentracing endpoint 应该放到配置中心里面
 */
export function getJaegerEndpoint() {
  return getProcessEnv() === 'prod'
    ? 'http://tracing-analysis-dc-bj-internal.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301/api/traces'
    : 'http://tracing-analysis-dc-bj.aliyuncs.com/adapt_f6vr9nkq0m@2c4af383d17198e_f6vr9nkq0m@53df7ad2afe8301_test/api/traces';
}

/**
 * 处理 image 流
 */
export function dealImage() {
  return map((res: any) => {
    const url = res.config.url;
    const ext = url.split('.').pop() || 'png';

    return {
      useStream: true,
      data: res.data,
      type: `image/${ext}`,
    };
  });
}

export function dealError() {
  return catchError((e: any) => mockResponse(null, 500, e.message));
}
