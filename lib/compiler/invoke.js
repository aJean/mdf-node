"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compilerOptions = void 0;
exports.default = _default;

var _module = _interopRequireDefault(require("module"));

var tsnode = _interopRequireWildcard(require("ts-node"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 执行 node file, REPL & eval mode
 */
const compilerOptions = {
  allowJs: true,
  noImplicitReturns: true,
  target: 'ES2015',
  module: 'CommonJS',
  moduleResolution: 'node',
  experimentalDecorators: true,
  forceConsistentCasingInFileNames: true,
  suppressImplicitAnyIndexErrors: true,
  skipLibCheck: true,
  declaration: false
};
exports.compilerOptions = compilerOptions;

function _default(scriptPath) {
  // 添加 require.extensions['ts'] 方法
  tsnode.register({
    compilerOptions: compilerOptions
  });
  process.argv = [process.argv[0], scriptPath]; // Module._load(process.argv[1])

  _module.default.runMain();
}