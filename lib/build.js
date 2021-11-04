"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("@mdfjs/utils");

var _client = _interopRequireDefault(require("./builder/client"));

var _rollup = _interopRequireDefault(require("./builder/rollup"));

var _mdf = _interopRequireDefault(require("./mdf/mdf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */
function _default(api) {
  api.registerCommand({
    name: 'build',

    fn() {
      return _asyncToGenerator(function* () {
        // @todo 与 webpack process 冲突
        const spinner = new _utils.Spinner({
          text: 'start to build'
        }).info(); // 清空 dist

        (0, _utils.rmrf)('dist'); // 创建 node 入口

        (0, _mdf.default)(api);
        yield (0, _rollup.default)(api);
        spinner.succeed({
          text: 'build success'
        });
        process.exit(0);
      })();
    }

  });
}
/**
 * 多模构建
 */


function multiPipe(_x, _x2) {
  return _multiPipe.apply(this, arguments);
}

function _multiPipe() {
  _multiPipe = _asyncToGenerator(function* (api, type) {
    const _api$getConfig = api.getConfig(),
          project = _api$getConfig.project;

    const spinner = new _utils.Spinner({
      text: 'start to build'
    }).info();

    switch (project.type) {
      // 混合项目需要先构建 client
      case 'hybrid':
        yield (0, _client.default)(api);
        spinner.start({
          text: 'build node files'
        });
        api.invokePlugin({
          key: 'processDone',
          type: api.PluginType.flush
        });
        yield (0, _rollup.default)(api);
        spinner.succeed({
          text: 'build success'
        });
        break;

      default:
        yield (0, _rollup.default)(api);
        spinner.succeed({
          text: 'build success'
        });
    }
  });
  return _multiPipe.apply(this, arguments);
}