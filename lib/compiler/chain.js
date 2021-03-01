"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getChain;

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackChain = _interopRequireDefault(require("webpack-chain"));

var _path = require("path");

var _pluginConfigs = require("./pluginConfigs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 编译 nest.js
 */
function getChain(userConfig) {
  const isDev = userConfig.isDev;
  const chain = new _webpackChain.default();
  chain.target('node').mode(isDev ? 'development' : 'production'); // entry

  chain.entry('main').add((0, _path.resolve)('src/server/main.ts')); // output

  chain.output.path((0, _path.resolve)('dist')).filename('main.js'); // extensions

  chain.resolve.extensions.clear().merge(['.ts', '.js']); // ts

  chain.module.rule('nodeJs').test(/\.ts$/).exclude.add(/node_modules/).end().use('tsLoader').loader(require.resolve('ts-loader')).options({
    onlyCompileBundledFiles: true
  }); // plugins

  chain.plugin('ignorePlugin').use(new _webpack.default.IgnorePlugin(_pluginConfigs.ignoreConfig));
  return chain;
}
/**
 * @deprecated 没必要使用 webpack
 */


function runWebpack(userConfig) {
  const compiler = (0, _webpack.default)(getChain(userConfig).toConfig());
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.toString('errors-only'));
    }
  });
}