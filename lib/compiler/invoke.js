"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.compilerOptions = void 0;

var _module = _interopRequireDefault(require("module"));

var tsnode = _interopRequireWildcard(require("ts-node"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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