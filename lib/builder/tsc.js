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
 * @file 使用 typescript 构建源码
 */
function _default(api) {
  const tscPaths = (0, _utils2.genTscPaths)(api);
  const files = (0, _utils.globFind)(tscPaths.watchFile); // .tmp/mdf-nest.ts

  const program = _typescript.default.createProgram(files, {
    outDir: tscPaths.outDir,
    allowJs: true,
    noImplicitReturns: true,
    target: _typescript.default.ScriptTarget.ES2017,
    module: _typescript.default.ModuleKind.CommonJS,
    moduleResolution: _typescript.default.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
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
  transformDefine([`${api.cwd}/${tscPaths.outDir}/shared/utils.js`], api);
  return Promise.resolve(errors.length ? errors : null);
}
/**
 * 等同 define plugin
 * TODO: 是否要对每个文件都 transform，但需要依赖 ts 的事件触发
 */


function transformDefine(files, api) {
  const babel = require('@babel/core');

  const opts = {
    cwd: __dirname,
    plugins: [['transform-inline-environment-variables', {
      include: ['MDF_ENV']
    }]]
  };

  try {
    files.forEach(file => {
      const data = babel.transformFileSync(file, opts);
      api.writeFile(file, data.code);
    });
  } catch (e) {}
}