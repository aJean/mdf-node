import { HttpService } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { getProcessEnv, getHeaderKeys } from './utils';

/**
 * @file 业务 service 抽象类
 */

export type Opts_Rpc = {
  request?: string;
  path?: string;
  method?: string;
  data?: any;
  headers?: any;
};

export abstract class AppService {
  type: string;

  constructor(type: string, protected httpService: HttpService, protected ct: ContextService) {
    this.type = type;
  }

  /**
   * 发送 rpc 请求, 熔断、限流都放到这里处理
   */
  rpc(opts: Opts_Rpc): Observable<any> {
    const http = this.httpService;
    const { request, path, method, data, headers } = opts;
    const url = request || `${this.ct.getHost(this.type)}/${path}`;
    const config = { headers: extractKeys(headers) };

    return method === 'POST' ? http.post(url, data, config) : http.get(url, config);
  }

  /**
   * 模拟返回 observable
   */
  mockResponse(data: any, status?: number, msg: string = '') {
    return from([{ data: { code: status === undefined ? 200 : status, msg, data } }]);
  }

  /**
   * 处理 image 流
   */
  dealImage() {
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

  /**
   * 处理异常
   */
  dealError() {
    return catchError((e: any) => this.mockResponse(null, 500, e.message));
  }
}

/**
 * 提取 header 中的透传字段
 */
function extractKeys(headers = {}, keys: Array<string> = getHeaderKeys()) {
  const ret = {};

  if (getProcessEnv() === 'dev') {
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
