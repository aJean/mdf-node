"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("@nestjs/common");

var opentracing = _interopRequireWildcard(require("opentracing"));

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

/**
 * @file 流量守卫
 *       中间件 -> 拦截器 -> 路由处理程序 -> 拦截器 -> 异常过滤器
 */
const tracer = (0, _utils.getJaegerTracer)();
let GuardMiddleware = class GuardMiddleware {
  constructor(httpService) {
    this.httpService = void 0;
    this.span = void 0;
    this.httpService = httpService;
    this.httpService.axiosRef.interceptors.request.use(config => {
      // controller -> service 是同步的
      if (this.span) {
        const span = this.span;
        span.tracer().inject(span.context(), opentracing.FORMAT_HTTP_HEADERS, config.headers);
      }

      return config;
    });
  }

  use(req, res, next) {
    const span = this.span = tracer.startSpan(req.baseUrl);
    req['__traceSpan__'] = span;
    span.log({
      time: Date.now(),
      query: req.query,
      body: req.body
    });
    next();
  }

};
GuardMiddleware = __decorate([(0, _common.Injectable)(), __metadata("design:paramtypes", [_common.HttpService])], GuardMiddleware);
var _default = GuardMiddleware;
exports.default = _default;