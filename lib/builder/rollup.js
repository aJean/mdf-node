"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _typescript = _interopRequireDefault(require("typescript"));

var rollup = _interopRequireWildcard(require("rollup"));

var _pluginReplace = _interopRequireDefault(require("@rollup/plugin-replace"));

var _pluginTypescript = _interopRequireDefault(require("@rollup/plugin-typescript"));

var _rollupPluginCommonjs = _interopRequireDefault(require("rollup-plugin-commonjs"));

var _rollupPluginNodeExternals = _interopRequireDefault(require("rollup-plugin-node-externals"));

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file rollup node builder
 */
function _default(api) {
  const _genTscPaths = (0, _utils.genTscPaths)(api),
        entry = _genTscPaths.entry,
        buildDir = _genTscPaths.buildDir,
        files = _genTscPaths.files;

  const compilerOptions = {
    allowJs: true,
    noImplicitReturns: true,
    target: _typescript.default.ScriptTarget.ES2017,
    module: _typescript.default.ModuleKind.ESNext,
    moduleResolution: _typescript.default.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    forceConsistentCasingInFileNames: true,
    suppressImplicitAnyIndexErrors: true,
    skipLibCheck: true,
    declaration: false,
    include: ['.tmp/mdf-nest.ts', files]
  };
  const config = {
    input: entry,
    output: {
      file: `${api.cwd}/${buildDir}/mdf-nest.js`,
      format: 'cjs'
    },
    plugins: [(0, _pluginReplace.default)({
      preventAssignment: true,
      'process.env.MDF_ENV': JSON.stringify(process.env.MDF_ENV || 'prod')
    }), (0, _pluginTypescript.default)(compilerOptions), // 忽略 builtins & deps
    (0, _rollupPluginNodeExternals.default)({
      packagePath: `${api.cwd}/package.json`,
      deps: true,
      devDeps: true
    }), (0, _rollupPluginCommonjs.default)()]
  };
  return rollup.rollup(config).then(bundle => bundle.write(config.output));
}