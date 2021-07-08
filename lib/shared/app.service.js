"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _mongodb = require("mongodb");

var _helper = _interopRequireDefault(require("./helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AppService {
  constructor(type, shared) {
    this.shared = void 0;
    this.type = void 0;
    this.shared = shared;
    this.type = type;
  }
  /**
   * 获取环境变量
   */


  getEnv(key) {
    return this.shared.getConfig(key);
  }
  /**
   * 连接 mongodb
   */


  getMongo() {
    const host = `mongodb://${this.getEnv('MONGO_HOST')}`;
    return _mongodb.MongoClient.connect(host, {
      useUnifiedTopology: true
    });
  }
  /**
   * 生产 rpc 请求 host，可用于调试
   */


  genRpcHost(path) {
    const type = this.type.toUpperCase();
    return `${this.getEnv(`API_HOST_${type}`)}/${path}`;
  }
  /**
   * 发送 rpc 请求, 熔断、限流都放到这里处理
   */


  rpc(opts) {
    const http = this.shared.http();
    const path = opts.path,
          method = opts.method,
          data = opts.data,
          headers = opts.headers;
    const host = this.genRpcHost(path);
    const config = {
      headers: extractKeys(headers)
    };
    return method === 'POST' ? http.post(host, data, config) : http.get(host, config);
  }
  /**
   * 发送普通 http 请求
   */


  send(opts) {
    const http = this.shared.http();
    const url = opts.url,
          method = opts.method,
          data = opts.data,
          config = opts.config;
    return method === 'POST' ? http.post(url, data, config) : http.get(url, config);
  }
  /**
   * 模拟返回 observable
   */


  pipeMock(data, status, msg = '') {
    return (0, _rxjs.from)([{
      data: {
        code: status === undefined ? 200 : status,
        msg,
        data
      }
    }]);
  }
  /**
   * 直接返回 data
   */


  pipeData(data) {
    return _objectSpread({
      _type: 'data'
    }, data);
  }
  /**
   * 处理 image 流
   */


  pipeImage() {
    return (0, _operators.map)(res => {
      const url = res.config.url;
      const ext = url.split('.').pop() || 'png';
      return {
        _type: 'img',
        data: res.data,
        mime: `image/${ext}`
      };
    });
  }
  /**
   * 处理异常
   */


  pipeError() {
    return (0, _operators.catchError)(e => this.pipeMock(null, 500, e.message));
  }

}
/**
 * 提取 header 中的透传字段
 */


exports.AppService = AppService;

function extractKeys(headers = {}, keys = _helper.default.getHeaderKeys()) {
  const ret = {};

  if (_helper.default.getProcessEnv() === 'dev') {
    keys.push('backdoor', 'talid', 'userid');
  }

  keys.forEach(key => {
    const val = headers[key];

    if (val) {
      ret[key] = headers[key];
    }
  });
  return ret;
}