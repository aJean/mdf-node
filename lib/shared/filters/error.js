"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("@nestjs/common");

var _core = require("@nestjs/core");

var _utils = require("../utils");

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
 * @file 全局异常捕获
 */
let ErrorFilter = class ErrorFilter extends _core.BaseExceptionFilter {
  constructor(logger) {
    super();
    this.logger = void 0;
    this.logger = logger;
    process.on('uncaughtException', e => {
      this.logger.error(`${e}`); // 不是自定义异常就让进程正常退出

      if (!(e instanceof _common.HttpException)) {
        process.exit(1);
      }
    });
  }
  /**
   * just like timeout
   */


  catch(error, host) {
    super.catch(error, host);
    const ctx = host.switchToHttp();
    this.doLog(ctx.getRequest(), error);
  }
  /**
   * 输出异常日志
   */


  doLog(request, error) {
    const url = request.url,
          headers = request.headers,
          method = request.method,
          body = request.body;
    const tokens = (0, _utils.getLogTokens)(headers);

    if (request['__traceSpan__']) {
      const span = request['__traceSpan__'];
      const tid = span.context().toTraceId();
      span.setTag('error', true).finish();
      request['__traceSpan__'] = null; // 输出 traceId，格式还是需要规范避免影响 log store

      return this.logger.error(`${method} ${url} ${tid} ${tokens} ${JSON.stringify(body)} ${error.stack}`);
    }

    this.logger.error(`${method} ${url} ${tokens} ${JSON.stringify(body)} ${error.stack}`);
  }

};
ErrorFilter = __decorate([(0, _common.Injectable)(), (0, _common.Catch)(), __param(0, (0, _common.Inject)(_common.Logger)), __metadata("design:paramtypes", [Object])], ErrorFilter);
var _default = ErrorFilter;
exports.default = _default;