"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genHttpFormat = genHttpFormat;
exports.TIMESTAMP_OPTS = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * @file 日志格式化
 */
function genHttpFormat() {
  return _winston.default.format.printf(debug => {
    const timestamp = debug.timestamp,
          level = debug.level,
          message = debug.message,
          args = _objectWithoutProperties(debug, ["timestamp", "level", "message"]);

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}] - ${message}`;
  });
}

const TIMESTAMP_OPTS = {
  format: 'YYYY-MM-DD HH:mm:ss'
};
exports.TIMESTAMP_OPTS = TIMESTAMP_OPTS;