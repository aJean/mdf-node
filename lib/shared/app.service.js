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
    const config = genAxiosConfig(headers);
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


  pipeMock(opts = {}) {
    const _type = opts._type,
          data = opts.data,
          _opts$code = opts.code,
          code = _opts$code === void 0 ? 200 : _opts$code,
          _opts$msg = opts.msg,
          msg = _opts$msg === void 0 ? '' : _opts$msg;
    return (0, _rxjs.from)([{
      _type,
      data: {
        code,
        msg,
        data
      }
    }]);
  }
  /**
   * 渲染模板数据
   */


  pipeHbs(data) {
    return _objectSpread({
      _type: 'hbs'
    }, data);
  }
  /**
   * 处理 image 流
   */


  pipeImage() {
    return (0, _operators.map)(res => {
      const ext = extractExt(res.config.url);
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


  pipeError(_type) {
    return (0, _operators.catchError)(e => {
      return this.pipeMock({
        _type,
        code: 500,
        msg: e.message
      });
    });
  }

}
/**
 * 提取 header 中的透传字段 + content-type
 */


exports.AppService = AppService;

function genAxiosConfig(data = {}, preset = _helper.default.getCustomHeaders()) {
  const headers = {};
  preset.forEach(key => {
    const val = data[key];

    if (val) {
      headers[key] = data[key];
    }
  });

  if (data['content-type']) {
    headers['content-type'] = data['content-type'];
  }

  return {
    headers
  };
}
/**
 * 从文件中提取 ext 类型
 */


function extractExt(file) {
  try {
    file = file.split('.').pop();
    return file.replace(/\?.*$/, '');
  } catch (e) {
    return 'png';
  }
}