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
 * @file 用于构建 node 代码，ts 是同步执行
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

  const result = program.emit();

  const diagnostics = _typescript.default.getPreEmitDiagnostics(program).concat(result.diagnostics);

  const errors = [];
  diagnostics.forEach(diagnostic => {
    const file = diagnostic.file;

    if (file) {
      const _file$getLineAndChara = file.getLineAndCharacterOfPosition(diagnostic.start),
            line = _file$getLineAndChara.line,
            character = _file$getLineAndChara.character;

      const message = _typescript.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      errors.push(`${file.fileName} (${line + 1}, ${character + 1}): ${message}`);
    } else {
      errors.push(_typescript.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });
  return Promise.resolve(errors.length ? errors : null);
}