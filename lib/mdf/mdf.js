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
        envs = _api$getConfig.envs; // 生成 mdf-nest.ts code


  const port = project.port || 3001;
  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port,
    envs,
    outputs: genOutputs(port),
    appFile: (0, _utils2.genTscPaths)(api).appFile,
    useLogger: project.useLogger !== false
  });
  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, (0, _utils.prettierFormat)(content));
}

function genOutputs(port) {
  return [{
    msg: `\\napp-server is runing at localhost:${port}`
  }];
}