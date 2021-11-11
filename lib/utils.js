"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanConsole = cleanConsole;
exports.genTscPaths = genTscPaths;
exports.safeGetProperty = safeGetProperty;

/**
 * @file utils
 */

/**
 * 根据项目类型生产匹配的目录
 */
function genTscPaths(api) {
  const _api$getConfig = api.getConfig(),
        project = _api$getConfig.project; // 所有项目的 node 代码产出目录都是 server


  const paths = {
    entry: `${api.paths.absTmpPath}/mdf-nest.ts`,
    setup: '.tmp/server/.tmp/mdf-nest.js',
    appFile: 'src/server/app.module',
    devDir: '.tmp/server',
    buildDir: 'dist/server',
    files: 'src/server/**/*'
  };

  switch (project.type) {
    case 'hybrid':
      return paths;

    default:
      return Object.assign(paths, {
        appFile: 'src/app.module',
        buildDir: 'dist',
        files: 'src/**/*'
      });
  }
}
/**
 * 安全获取对象属性，找不到就返回 undefined
 */


function safeGetProperty(path, target) {
  const tokens = path.split('.');
  let result = target;

  while (tokens.length) {
    const token = tokens.shift();

    if (result[token]) {
      result = result[token];
    } else {
      return undefined;
    }
  }

  return result;
}
/**
 * 清除控制台
 */


function cleanConsole() {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
}