"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    setup: '.tmp/server/.tmp/mdf-nest.js',
    watchFile: `${api.paths.absTmpPath}/mdf-nest.ts`,
    appFile: 'src/server/app.module',
    devDir: '.tmp/server',
    outDir: 'dist/server'
  };

  switch (project.type) {
    case 'hybrid':
      return paths;

    default:
      paths.appFile = 'src/app.module';
      return paths;
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