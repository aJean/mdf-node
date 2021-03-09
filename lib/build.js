"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ora = _interopRequireDefault(require("ora"));

var _utils = require("./utils");

var _utils2 = require("@mdfjs/utils");

var _client = _interopRequireDefault(require("./builder/client"));

var _node = _interopRequireDefault(require("./builder/node"));

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
              project = _api$getConfig.project;

        const tscPaths = (0, _utils.genTscPaths)(api); // @todo 与 webpack process 冲突

        const spinner = (0, _ora.default)().info('start to build'); // 清空 dist

        rimraf.sync(tscPaths.absOutDir); // 混合项目需要先构建 client

        if (project.type === 'hybrid') {
          (0, _client.default)(api).then(() => {
            spinner.start('build node files');
            api.invokePlugin({
              key: 'processDone',
              type: api.PluginType.flush
            });
            (0, _node.default)(api).then(errors => finish(errors));
          }, e => (0, _utils2.errorPrint)(e));
        } else {
          (0, _node.default)(api).then(errors => finish(errors));
        }
        /**
         * error 要删除 dist
         */


        function finish(errors) {
          if (errors) {
            spinner.color = 'red';
            spinner.fail('build error');
            rimraf.sync(tscPaths.absOutDir);
            (0, _utils2.chalkPrints)([[`error: `, 'red'], errors[0]]);
          } else {
            spinner.color = 'yellow';
            spinner.succeed('build success');
          }
        }
      })();
    }

  });
}