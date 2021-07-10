"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedModule = exports.SharedService = void 0;

var _common = require("@nestjs/common");

var _config = require("@nestjs/config");

var _serveStatic = _interopRequireDefault(require("@nestjs/serve-static"));

var _helper = _interopRequireDefault(require("./helper"));

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

var SharedModule_1;

/**
 * @file shared 公共服务
 */
let SharedService = class SharedService {
  constructor(httpService, configService) {
    this.httpService = void 0;
    this.configService = void 0;
    this.httpService = httpService;
    this.configService = configService;
  }

  http() {
    return this.httpService;
  }

  config() {
    return this.configService;
  }

  getConfig(key) {
    return this.config().get(key);
  }

};
exports.SharedService = SharedService;
exports.SharedService = SharedService = __decorate([(0, _common.Injectable)(), __metadata("design:paramtypes", [_common.HttpService, _config.ConfigService])], SharedService);
let SharedModule = SharedModule_1 = class SharedModule {
  static forRoot(opts = {}) {
    const _opts$timeout = opts.timeout,
          timeout = _opts$timeout === void 0 ? 15000 : _opts$timeout,
          serve = opts.serve;
    const imports = [_common.HttpModule.register({
      timeout
    }), _config.ConfigModule.forRoot({
      envFilePath: _helper.default.genEnvFiles(),
      isGlobal: true
    })];

    if (serve) {
      imports.push(_serveStatic.default.ServeStaticModule.forRoot({
        rootPath: serve.rootPath,
        serveRoot: serve.serveRoot
      }));
    }

    return {
      module: SharedModule_1,
      imports,
      providers: [SharedService],
      exports: [_common.HttpModule, SharedService]
    };
  }

};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = SharedModule_1 = __decorate([(0, _common.Module)({
  imports: [],
  providers: [],
  exports: []
})], SharedModule);