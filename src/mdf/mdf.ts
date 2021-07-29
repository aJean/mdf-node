import { IApi } from '@mdfjs/types';
import { prettierFormat } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file mdf-node server 入口
 */

export default function (api: IApi) {
  const { paths, Mustache } = api;
  const { project, envs } = api.getConfig();
  const { port = 3001, timeout, uselog } = project;

  // 生成 mdf-nest.ts code
  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port,
    envs,
    shared: { timeout },
    uselog: uselog !== false,
    outputs: genOutputs(port),
    appFile: genTscPaths(api).appFile,
  });

  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, prettierFormat(content));
}

function genOutputs(port: string) {
  return [{ msg: `\\napp-server is runing at localhost:${port}` }];
}
