"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// require('update-notifier');

/**
 * @file node 插件集
 */
function _default(api) {
  const presets = [require.resolve('@mdfjs/react'), require.resolve('./dev'), require.resolve('./build')];
  return {
    presets
  };
}