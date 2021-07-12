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
  type: string;

  constructor(type: string, protected shared: SharedService) {
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
    const type = this.type.toUpperCase();
    return `${this.getEnv(`API_HOST_${type}`)}/${path}`;
  }

  /**
   * 发送 rpc 请求, 熔断、限流都放到这里处理
   */
  rpc(opts: Opts_Rpc): Observable<any> {
    const http = this.shared.http();
    const { path, method, data, headers } = opts;
    const host = this.genRpcHost(path);
    const config = { headers: extractKeys(headers) };

    return method === 'POST' ? http.post(host, data, config) : http.get(host, config);
  }

  /**
   * 发送普通 http 请求
   */
  send(opts: Http_Rpc) {
    const http = this.shared.http();
    const { url, method, data, config } = opts;

    return method === 'POST' ? http.post(url, data, config) : http.get(url, config);
  }

  /**
   * 模拟返回 observable
   */
  pipeMock(opts: Mock_Rpc = {}) {
    const { _type, data, code = 200, msg = '' } = opts;
    return from([{ _type, data: { code, msg, data } }]);
  }

  /**
   * 渲染模板数据
   */
  pipeHbs(data: any) {
    return { _type: 'hbs', ...data };
  }

  /**
   * 处理 image 流
   */
  pipeImage() {
    return map((res: any) => {
      const ext = extractExt(res.config.url);

      return {
        _type: 'img',
        data: res.data,
        mime: `image/${ext}`,
      };
    });
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
 * 提取 header 中的透传字段
 */
function extractKeys(headers = {}, keys: Array<string> = Helper.getCustomHeaders()) {
  const ret = {};

  if (Helper.getProcessEnv() === 'dev') {
    keys.push('backdoor', 'talid', 'userid');
  }

  keys.forEach((key: string) => {
    const val = headers[key];

    if (val) {
      ret[key] = headers[key];
    }
  });

  return ret;
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
