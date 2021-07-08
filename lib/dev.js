"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _tsc = _interopRequireDefault(require("./runner/tsc"));

var _client = _interopRequireDefault(require("./runner/client"));

var _mdf = _interopRequireDefault(require("./mdf/mdf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file 重写 mdfjs 的 dev
 *       命令上区分 client 和 server，毕竟都需要 stdout，所以启两个进程也比较合理
 *       client 支持 react、vue、angular ?
 *       server 默认使用 nest.js
 */
function _default(api) {
  api.registerCommand({
    name: 'dev',

    fn(args) {
      return _asyncToGenerator(function* () {
        let runner; // 启动 server 部分

        if (args.node) {
          (0, _mdf.default)(api);
          runner = new _tsc.default({
            api,
            tsconfigPath: require.resolve('../tsconfig.json')
          });
          runner.run();
        } else {
          runner = new _client.default({
            api
          });
          yield runner.run();
        }
      })();
    }

  });
}