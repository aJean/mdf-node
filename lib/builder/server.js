"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _typescript = _interopRequireDefault(require("typescript"));

var _utils = require("@mdfjs/utils");

var _utils2 = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 用于构建 node 代码
 */
function _default(api) {
  const tscPaths = (0, _utils2.genTscPaths)(api);
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
}