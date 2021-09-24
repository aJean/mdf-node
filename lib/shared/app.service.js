"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppService = void 0;

var _utils = require("@mdfjs/utils");

var _uaParserJs = _interopRequireDefault(require("ua-parser-js"));

var opentracing = _interopRequireWildcard(require("opentracing"));

var _common = require("@nestjs/common");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _mongodb = require("mongodb");

var _shared = require("./shared.module");

var _helper = _interopRequireDefault(require("./helper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

class AppService {
  constructor(type) {
    this.shared = void 0;
    this.type = void 0;
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
    if (/http(s)?/.test(path)) {
      return path;
    }

    const type = this.type.toUpperCase();
    return `${this.getEnv(`API_HOST_${type}`)}/${path}`;
  }
  /**
   * 发送 rpc 请求, 熔断、限流都放到这里处理
   */


  rpc(opts) {
    const path = opts.path,
          method = opts.method,
          data = opts.data,
          headers = opts.headers;

    if (headers === null || headers === void 0 ? void 0 : headers.debug) {
      (0, _utils.chalkPrints)([[`[debug]`, 'grey'], ` ${method} - ${this.genRpcHost(path)}`]);
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


  send(opts) {
    const http = this.shared.http();
    const url = opts.url,
          method = opts.method,
          data = opts.data,
          config = opts.config;
    return method === 'POST' ? http.post(url, data, config) : http.get(url, config);
  }
  /**
   * @observer 模拟返回 observable
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
   * @observer 处理 image 流
   */


  pipeImage() {
    return (0, _operators.map)(res => {
      const ext = extractExt(res.config.url);
      return {
        _type: 'pic',
        data: res.data,
        mime: `image/${ext}`
      };
    });
  }
  /**
   * @promise 渲染模板数据
   */


  pipeHbs(data) {
    return _objectSpread({
      _type: 'hbs'
    }, data);
  }
  /**
   * @promise promethus 接口
   */


  pipeProm(data) {
    return {
      _type: 'prom',
      data
    };
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

exports.AppService = AppService;

__decorate([(0, _common.Inject)('SharedService'), __metadata("design:type", _shared.SharedService)], AppService.prototype, "shared", void 0);
/**
 * 更多 config 配置
 */


function genAxiosConfig(data = {}) {
  const headers = {};

  _helper.default.getCustomHeaders().forEach(key => {
    const val = data[key];

    if (val) {
      if (key == 'user-agent') {
        headers['app'] = genAgent(val);
      } else {
        headers[key] = val;
      }
    }
  }); // 为 axios request 注入 trace id


  if (data['__traceSpan__']) {
    const span = data['__traceSpan__'];
    span.tracer().inject(span.context(), opentracing.FORMAT_HTTP_HEADERS, headers);
    delete data['__traceSpan__'];
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
/**
 * 解析 user-agent 减少传输体积，给后端明确的含义
 */


function genAgent(ua) {
  const obj = (0, _uaParserJs.default)(ua);
  const os = obj.os.name;
  const device = obj.device.model;
  const browser = obj.browser.name;
  let info = `[os: ${os}] [device: ${device}] [browser: ${browser}]`;

  if (!os || !device || !browser) {
    info += ` [ua: ${obj.ua}]`;
  } // 检查 app 版本


  const app = /DSApp_(.*)/.exec(ua);

  if (app) {
    info += ` [app: ${app[1]}]`;
  }

  return info;
}