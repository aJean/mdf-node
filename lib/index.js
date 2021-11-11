"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Winston: true,
  Rxjs: true,
  Core: true,
  Express: true
};
exports.Winston = exports.Rxjs = exports.Express = exports.Core = void 0;
exports.default = _default;

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

var Rxjs_1 = _interopRequireWildcard(require("rxjs"));

exports.Rxjs = Rxjs_1;

var Core_1 = _interopRequireWildcard(require("@nestjs/core"));

exports.Core = Core_1;

var Express_1 = _interopRequireWildcard(require("@nestjs/platform-express"));

exports.Express = Express_1;

var _shared = require("./shared");

Object.keys(_shared).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _shared[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _shared[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @file mdf-node 插件集
 */
function _default(api) {
  const presets = [// require.resolve('@mdfjs/react'), whill remove client render from mdf-node
  require.resolve('./dev'), require.resolve('./build')];
  return {
    presets
  };
}