"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Winston: true,
  Helper: true,
  Rxjs: true,
  Core: true,
  Express: true,
  Serve: true
};
exports.default = _default;
exports.Serve = exports.Express = exports.Core = exports.Rxjs = exports.Helper = exports.Winston = void 0;

var Winston = _interopRequireWildcard(require("winston"));

exports.Winston = Winston;

require("winston-daily-rotate-file");

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

var _config = require("@nestjs/config");

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _config[key];
    }
  });
});

var _nestWinston = require("nest-winston");

Object.keys(_nestWinston).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _nestWinston[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _nestWinston[key];
    }
  });
});

var Helper_1 = _interopRequireWildcard(require("./mdf/helper"));

exports.Helper = Helper_1;

var Rxjs_1 = _interopRequireWildcard(require("rxjs"));

exports.Rxjs = Rxjs_1;

var Core_1 = _interopRequireWildcard(require("@nestjs/core"));

exports.Core = Core_1;

var Express_1 = _interopRequireWildcard(require("@nestjs/platform-express"));

exports.Express = Express_1;

var Serve_1 = _interopRequireWildcard(require("@nestjs/serve-static"));

exports.Serve = Serve_1;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @file mdf-node 插件集
 */
// require('update-notifier');
function _default(api) {
  const presets = [require.resolve('@mdfjs/react'), require.resolve('./dev'), require.resolve('./build')];
  return {
    presets
  };
}