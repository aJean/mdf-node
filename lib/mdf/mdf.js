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
        node = _api$getConfig.node,
        envs = _api$getConfig.envs;

  const _project$port = project.port,
        port = _project$port === void 0 ? 3001 : _project$port; // 生成 mdf-nest.ts code

  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port,
    envs,
    shared: JSON.stringify(node),
    uselog: node.uselog !== false,
    outputs: genOutputs(port),
    appFile: (0, _utils2.genTscPaths)(api).appFile
  });
  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, (0, _utils.prettierFormat)(content));
}

function genOutputs(port) {
  return [{
    msg: `\\napp-server is runing at localhost:${port}`
  }];
}