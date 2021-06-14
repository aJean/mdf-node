"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  rxjs: true,
  core: true,
  express: true
};
exports.default = _default;
exports.express = exports.core = exports.rxjs = void 0;

var rxjs = _interopRequireWildcard(require("rxjs"));

exports.rxjs = rxjs;

var core = _interopRequireWildcard(require("@nestjs/core"));

exports.core = core;

var express = _interopRequireWildcard(require("@nestjs/platform-express"));

exports.express = express;

var _common = require("@nestjs/common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _common[key];
    }
  });
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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