"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("@nestjs/common");

var _helper = _interopRequireDefault(require("../helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * @file 流量守卫 [中间件 -> 拦截器 -> 路由处理程序 -> 拦截器 -> 异常过滤器]
 */
let GuardMiddleware = class GuardMiddleware {
  /**
   * 链路生成 span
   */
  use(req, res, next) {
    const tracer = _helper.default.getJaegerTracer();

    const span = tracer.startSpan(req.baseUrl); // @ts-ignore

    req['__traceSpan__'] = req.headers['__traceSpan__'] = span;
    span.log({
      time: Date.now(),
      query: req.query,
      body: req.body
    });
    next();
  }

};
GuardMiddleware = __decorate([(0, _common.Injectable)()], GuardMiddleware);
var _default = GuardMiddleware;
exports.default = _default;