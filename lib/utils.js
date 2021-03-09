"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genTscPaths = genTscPaths;

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