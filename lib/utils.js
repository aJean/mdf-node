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
 * TODO: main.ts 作为唯一 root 也生成到 .tmp 目录中，避免干扰用户代码
 */
function genTscPaths(api) {
  const _api$getConfig = api.getConfig(),
        project = _api$getConfig.project; // 所有项目的 node 代码产出目录都是 server


  const paths = {
    watchFile: `${api.cwd}/src/server/**.ts`,
    startFile: 'dist/server/main.js',
    mainFile: 'server/main.ts',
    outDir: 'dist/server',
    absOutDir: `${api.cwd}/dist`
  };

  switch (project.type) {
    case 'hybrid':
      return paths;

    default:
      paths.watchFile = `${api.cwd}/src/**.ts`;
      paths.mainFile = 'main.ts';
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