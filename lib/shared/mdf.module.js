"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MdfModule = exports.MdfService = void 0;

var _common = require("@nestjs/common");

var _config = require("@nestjs/config");

var _serveStatic = _interopRequireDefault(require("@nestjs/serve-static"));

var _utils = require("./utils");

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

var MdfModule_1;

/**
 * @file mdf 公共服务
 */
let MdfService = class MdfService {
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
exports.MdfService = MdfService;
exports.MdfService = MdfService = __decorate([(0, _common.Injectable)(), __metadata("design:paramtypes", [_common.HttpService, _config.ConfigService])], MdfService);
let MdfModule = MdfModule_1 = class MdfModule {
  static forRoot(opts) {
    const timeout = opts.timeout,
          serve = opts.serve,
          envs = opts.envs;
    const imports = [_common.HttpModule.register({
      timeout
    }), _config.ConfigModule.forRoot({
      envFilePath: envs,
      isGlobal: true
    })];

    if (serve) {
      imports.push(_serveStatic.default.ServeStaticModule.forRoot({
        rootPath: serve.rootPath,
        serveRoot: serve.serveRoot
      }));
    }

    return {
      ngModule: MdfModule_1,
      imports,
      providers: [MdfService],
      exports: [_common.HttpModule, MdfService]
    };
  }

};
exports.MdfModule = MdfModule;
exports.MdfModule = MdfModule = MdfModule_1 = __decorate([(0, _common.Module)({
  imports: [_common.HttpModule.register({
    timeout: 15000
  }), _config.ConfigModule.forRoot({
    envFilePath: (0, _utils.genEnvFiles)(),
    isGlobal: true
  })],
  providers: [MdfService],
  exports: [_common.HttpModule, MdfService]
})], MdfModule);