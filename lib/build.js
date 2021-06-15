"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("@mdfjs/utils");

var _browser = _interopRequireDefault(require("./builder/browser"));

var _rollup = _interopRequireDefault(require("./builder/rollup"));

var _mdf = _interopRequireDefault(require("./mdf/mdf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */
const rimraf = require('rimraf');

function _default(api) {
  api.registerCommand({
    name: 'build',

    fn() {
      return _asyncToGenerator(function* () {
        const _api$getConfig = api.getConfig(),
              project = _api$getConfig.project; // @todo 与 webpack process 冲突


        const spinner = new _utils.Spinner({
          text: 'start to build'
        }).info(); // 清空 dist

        rimraf.sync('dist'); // 创建 node 入口

        (0, _mdf.default)(api); // 混合项目需要先构建 client

        if (project.type === 'hybrid') {
          (0, _browser.default)(api).then(() => {
            spinner.start({
              text: 'build node files'
            });
            api.invokePlugin({
              key: 'processDone',
              type: api.PluginType.flush
            });
            (0, _rollup.default)(api).then(() => spinner.succeed({
              text: 'build success'
            })).catch(e => doError(e));
          }, e => (0, _utils.errorPrint)(e));
        } else {
          (0, _rollup.default)(api).then(() => spinner.succeed({
            text: 'build success'
          })).catch(e => doError(e));
        }
        /**
         * error 要删除 dist
         */


        function doError(e) {
          spinner.fail({
            text: 'build error'
          });
          console.error(e);
          rimraf.sync('dist');
        }
      })();
    }

  });
}