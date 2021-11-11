"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("@nestjs/common");

var _operators = require("rxjs/operators");

var _stream = require("stream");

var _helper = _interopRequireDefault(require("../helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

/**
 * @file 接口数据处理
 */
let HttpInterceptor = class HttpInterceptor {
  constructor(logger) {
    this.logger = void 0;
    this.logger = logger;
  }
  /**
   * 拦截器，用于请求配置与返回结果的处理
   */


  intercept(context, next) {
    const ctx = context.switchToHttp();
    return next.handle().pipe((0, _operators.map)(result => {
      const req = ctx.getRequest();
      const res = ctx.getResponse();
      const data = result.data;
      const code = res.statusCode;

      switch (result._type) {
        // 模板渲染
        case 'hbs':
          return result;
        // promethus http exporter

        case 'prom':
          res.set({
            'Content-Type': 'text/plain'
          });
          return result.data;
        // 静态资源 cors 中转

        case 'pic':
          // 图片下载失败
          if (!(data instanceof Buffer)) {
            this.pipeLog(req, `${code}/500`);
            return res.end(null);
          }

          const stream = new _stream.Readable();
          stream.push(data);
          stream.push(null);
          res.set({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': result.mime,
            'Content-Length': data.length
          });
          this.pipeLog(ctx.getRequest(), `${code}/200`);
          return stream.pipe(res);
        // 标准 mdf server 接口

        default:
          const _Helper$getAppModule = _helper.default.getAppModule(),
                handleLog = _Helper$getAppModule.handleLog;

          handleLog && handleLog(result, req, res);
          this.pipeLog(req, `${code}/${data.code}`);
          res.set({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          });

          if (req['__traceSpan__']) {
            req['__traceSpan__'].finish();
            req['__traceSpan__'] = null;
          }

          return Object.assign(data, {
            from: 'mdf-node'
          });
      }
    }));
  }
  /**
   * 请求日志
   */


  pipeLog(req, stauts) {
    const url = req.url,
          headers = req.headers,
          method = req.method,
          body = req.body;

    const tokens = _helper.default.getLogTokens(headers);

    this.logger.log(` [${stauts}] ${method} ${url} ${tokens} ${JSON.stringify(body)}`, 'HttpInterceptor');
  }

};
HttpInterceptor = __decorate([(0, _common.Injectable)(), __param(0, (0, _common.Inject)(_common.Logger)), __metadata("design:paramtypes", [Object])], HttpInterceptor);
var _default = HttpInterceptor;
exports.default = _default;