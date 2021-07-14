import { IApi } from '@mdfjs/types';
import { prettierFormat } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file mdf-node server 入口
 */

export default function (api: IApi) {
  const { paths, Mustache } = api;
  const { project, envs } = api.getConfig();

  // 生成 mdf-nest.ts code
  const port = project.port || 3001;
  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port,
    envs,
    outputs: genOutputs(port),
    appFile: genTscPaths(api).appFile,
    useLogger: project.useLogger !== false,
  });

  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, prettierFormat(content));
}

function genOutputs(port: string) {
  const ip = require('internal-ip');

  return [
    { msg: '\\r' },
    { msg: ` - app-server is runing at localhost:${port}` },
    { msg: ` - app-server is runing at ${ip.v4.sync()}:${port}` },
  ];
}
