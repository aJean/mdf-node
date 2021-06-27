"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bundlerWebpack = _interopRequireDefault(require("@mdfjs/bundler-webpack"));

var _server = require("@mdfjs/server");

var _utils = require("@mdfjs/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class ClientRunner {
  constructor(opts) {
    this.api = void 0;
    this.configPath = void 0;
    this.api = opts.api;
  }

  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const api = _this.api;
      const paths = api.paths;
      const spinner = new _utils.Spinner({
        text: 'generate mdf',
        graph: 'dots'
      }).start();
      api.makeDir(paths.absTmpPath);
      yield _this.generateCode();
      spinner.succeed({
        text: 'generate success'
      });

      _this.startServer();
    })();
  }

  startServer() {
    const api = this.api;
    const PluginType = api.PluginType,
          cwd = api.cwd;
    const config = api.getConfig(); // instance

    config.isDev = true;
    const bundler = new _bundlerWebpack.default(config);
    bundler.generateConfig({
      changeUserConfig(userConfig) {
        return api.invokePlugin({
          type: PluginType.modify,
          key: 'userConfig',
          initValue: userConfig
        });
      },

      changeWebpackConfig(chain) {
        return api.invokePlugin({
          type: PluginType.event,
          key: 'chainWebpack',
          args: [chain]
        });
      },

      changeBundleConfig(bundleConfig) {
        return api.invokePlugin({
          type: PluginType.modify,
          key: 'bundleConfig',
          initValue: bundleConfig
        });
      }

    });
    api.invokePlugin({
      key: 'onBuildComplete',
      type: PluginType.event
    }); // dev pipeline

    const _bundler$setupDev = bundler.setupDev(),
          webpackCompiler = _bundler$setupDev.webpackCompiler,
          serverOpts = _bundler$setupDev.serverOpts;

    (0, _server.startDevServer)(webpackCompiler, serverOpts).then(res => {
      this.initWatchers(res.server); // 必须加个延时，要在 webpack 之后输出

      setTimeout(function () {
        api.invokePlugin({
          key: 'processDone',
          type: PluginType.flush
        });
        (0, _utils.chalkPrints)([[`\nsuccess: `, 'green'], ` mdf server`]);
        console.log(` - ${res.msg}`);
      }, 800);
    });
  }
  /**
   * 监控变化
   */


  initWatchers(server) {
    const api = this.api; // important watchs

    const unwatchs = [];
    const unwatchConfig = (0, _utils.watch)({
      path: `${api.cwd}/config`,
      useMemo: true,
      onChange: function onChange(type, path) {
        (0, _utils.chalkPrints)([[`${type}: `, 'green'], ` ${path}`]);
        (0, _utils.chalkPrints)([[`restart: `, 'yellow'], ` mdf server`]);
        unwatchs.forEach(unwatch => unwatch());
        server.close();
        process.send({
          type: 'RESTART'
        });
      }
    }); // 变化比较快，没必要提示了

    const unwatchApp = (0, _utils.watch)({
      path: `${api.cwd}/${(0, _utils.genAppPath)(api)}`,
      onChange: () => this.generateCode()
    });
    unwatchs.push(unwatchConfig, unwatchApp);
  }

  generateCode() {
    const api = this.api;
    return api.invokePlugin({
      key: 'codeGenerate',
      type: api.PluginType.event
    });
  }

}

exports.default = ClientRunner;