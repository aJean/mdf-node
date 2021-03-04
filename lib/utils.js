"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genTscPaths = genTscPaths;

/**
 * @file utils
 */
function genTscPaths(api) {
  const _api$getConfig = api.getConfig(),
        project = _api$getConfig.project;

  switch (project.type) {
    case 'hybrid':
      return {
        watchFile: `${api.cwd}/src/server/**.ts`,
        startFile: 'dist/server/main.js',
        outDir: 'dist/server',
        absOutDir: `${api.cwd}/dist`
      };

    default:
      return {
        watchFile: `${api.cwd}/src/**.ts`,
        startFile: 'dist/main.js',
        outDir: 'dist',
        absOutDir: `${api.cwd}/dist`
      };
  }
}