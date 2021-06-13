"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("@mdfjs/utils");

var _utils2 = require("../utils");

/**
 * @file mdf-node server 入口
 */
function _default(api) {
  const paths = api.paths,
        Mustache = api.Mustache;

  const _api$getConfig = api.getConfig(),
        project = _api$getConfig.project,
        envs = _api$getConfig.envs; // 生成 mdf-nest.ts 内容


  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port: project.port || 3001,
    envs,
    appFile: (0, _utils2.genTscPaths)(api).appFile,
    formatPath: require.resolve('./formate')
  });
  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, (0, _utils.prettierFormat)(content));
}