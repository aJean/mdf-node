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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file rollup node builder
 */
function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (api) {
    const tscPaths = (0, _utils.genTscPaths)(api);
    const compilerOptions = {
      outDir: tscPaths.outDir,
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
      declaration: false
    };
    const config = {
      input: tscPaths.watchFile,
      output: {
        file: `${api.cwd}/dist/server/mdf-nest.js`,
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
    const bundle = yield rollup.rollup(config);
    return bundle.write(config.output);
  });
  return _ref.apply(this, arguments);
}