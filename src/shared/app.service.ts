import { chalkPrints } from '@mdfjs/utils';
import parser from 'ua-parser-js';
import * as opentracing from 'opentracing';
import { Inject } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MongoClient } from 'mongodb';
import { SharedService } from './shared.module';
import Helper from './helper';

/**
 * @file app service
 */

export type Opts_Rpc = {
  path?: string;
  method?: string;
  data?: any;
  headers?: any;
};

export type Http_Rpc = {
  url: string;
  method?: string;
  data?: any;
  config?: any;
};

export type Mock_Rpc = {
  _type?: string;
  data?: any;
  code?: number;
  msg?: string;
};

export abstract class AppService {
  @Inject('SharedService')
  private readonly shared: SharedService;
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  /**
   * 获取环境变量
   */
  getEnv(key: string) {
    return this.shared.getConfig(key);
  }

  /**
   * 连接 mongodb
   */
  getMongo() {
    const host = `mongodb://${this.getEnv('MONGO_HOST')}`;
    return MongoClient.connect(host, { useUnifiedTopology: true });
  }

  /**
   * 生产 rpc 请求 host，可用于调试
   */
  genRpcHost(path: string) {
    if (/http(s)?/.test(path)) {
      return path;
    }

    const type = this.type.toUpperCase();
    return `${this.getEnv(`API_HOST_${type}`)}/${path}`;
  }

  /**
   * 发送 rpc 请求, 熔断、限流都放到这里处理
   */
  rpc(opts: Opts_Rpc): Observable<any> {
    const { path, method, data, headers } = opts;

    if (headers?.debug) {
      chalkPrints([[`[debug]`, 'grey'], ` ${method} - ${this.genRpcHost(path)}`]);
      delete headers.debug;
    }

    const http = this.shared.http();
    const host = this.genRpcHost(path);
    const config = genAxiosConfig(headers);

    return method === 'POST' ? http.post(host, data, config) : http.get(host, config);
  }

  /**
   * 发送普通 http 请求
   */
  send(opts: Http_Rpc): Observable<any> {
    const http = this.shared.http();
    const { url, method, data, config } = opts;

    return method === 'POST' ? http.post(url, data, config) : http.get(url, config);
  }

  /**
   * @observer 模拟返回 observable
   */
  pipeMock(opts: Mock_Rpc = {}) {
    const { _type, data, code = 200, msg = '' } = opts;
    return from([{ _type, data: { code, msg, data } }]);
  }

  /**
   * @observer 处理 image 流
   */
  pipeImage() {
    return map((res: any) => {
      const ext = extractExt(res.config.url);

      return {
        _type: 'pic',
        data: res.data,
        mime: `image/${ext}`,
      };
    });
  }

  /**
   * @promise 渲染模板数据
   */
  pipeHbs(data: any) {
    return { _type: 'hbs', ...data };
  }

  /**
   * @promise promethus 接口
   */
  pipeProm(data: any) {
    return { _type: 'prom', data };
  }

  /**
   * 处理异常
   */
  pipeError(_type?: string) {
    return catchError((e: any) => {
      return this.pipeMock({ _type, code: 500, msg: e.message });
    });
  }
}

/**
 * 更多 config 配置
 */
function genAxiosConfig(data: any = {}) {
  const headers = {};

  Helper.getCustomHeaders().forEach((key: string) => {
    const val = data[key];

    if (val) {
      if (key == 'user-agent') {
        headers['app'] = genAgent(val);
      } else {
        headers[key] = val;
      }
    }
  });

  // 为 axios request 注入 trace id
  if (data['__traceSpan__']) {
    const span = data['__traceSpan__'];
    span.tracer().inject(span.context(), opentracing.FORMAT_HTTP_HEADERS, headers);
    delete data['__traceSpan__'];
  }

  return { headers };
}

/**
 * 从文件中提取 ext 类型
 */
function extractExt(file: string) {
  try {
    file = file.split('.').pop();
    return file.replace(/\?.*$/, '');
  } catch (e) {
    return 'png';
  }
}

/**
 * 解析 user-agent 减少传输体积，给后端明确的含义
 */
function genAgent(ua: string) {
  const obj: any = parser(ua);
  const os = obj.os.name;
  const device = obj.device.model;
  const browser = obj.browser.name;

  let info = `[os: ${os}] [device: ${device}] [browser: ${browser}]`;

  if (!os || !device || !browser) {
    info += ` [ua: ${obj.ua}]`;
  }

  // 检查 app 版本
  const app = /DSApp_(.*)/.exec(ua);
  if (app) {
    info += ` [app: ${app[1]}]`;
  }

  return info;
}
