"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = require("path");

var _utils = require("@mdfjs/utils");

var _utils2 = require("../utils");

/**
 * @file 生产 node server main 入口
 */
function _default(api) {
  const paths = api.paths,
        Mustache = api.Mustache;

  const _api$getConfig = api.getConfig(),
        project = _api$getConfig.project,
        envs = _api$getConfig.envs;

  const _genTscPaths = (0, _utils2.genTscPaths)(api),
        mainFile = _genTscPaths.mainFile;

  const mainTpl = api.getFile((0, _path.join)(__dirname, './main.tpl')); // 生成 main.ts 内容

  const mainContent = Mustache.render(mainTpl, {
    port: project.port || 3001,
    envs,
    formatPath: require.resolve('./formate')
  });
  api.writeFile(`${paths.absSrcPath}/${mainFile}`, (0, _utils.prettierFormat)(mainContent));
}