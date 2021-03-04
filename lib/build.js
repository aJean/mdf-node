"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _typescript = _interopRequireDefault(require("typescript"));

var _utils = require("@mdfjs/utils");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file 构建产物
 * @todo 需要清除 dist + client build
 */
function _default(api) {
  api.registerCommand({
    name: 'build',

    fn() {
      return _asyncToGenerator(function* () {
        const tscPaths = (0, _utils2.genTscPaths)(api);

        const rimraf = require('rimraf');

        rimraf.sync(tscPaths.absOutDir); // 需要实现 plugin 的 build 来处理 client 部分, 当然也要判断 project
        // server build

        const files = (0, _utils.globFind)(tscPaths.watchFile);

        const program = _typescript.default.createProgram(files, {
          outDir: tscPaths.outDir,
          allowJs: true,
          noImplicitReturns: true,
          target: _typescript.default.ScriptTarget.ES2015,
          module: _typescript.default.ModuleKind.CommonJS,
          moduleResolution: _typescript.default.ModuleResolutionKind.NodeJs,
          experimentalDecorators: true,
          forceConsistentCasingInFileNames: true,
          suppressImplicitAnyIndexErrors: true,
          skipLibCheck: true,
          declaration: false
        });

        program.emit();
      })();
    }

  });
}