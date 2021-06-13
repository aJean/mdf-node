import { IApi } from '@mdfjs/types';
import { prettierFormat } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file mdf-node server 入口
 */

export default function (api: IApi) {
  const { paths, Mustache } = api;
  const { project, envs } = api.getConfig();
  // 生成 mdf-nest.ts 内容
  const content = Mustache.render(api.getFile(`${__dirname}/mdf.tpl`), {
    port: project.port || 3001,
    envs,
    appFile: genTscPaths(api).appFile,
    formatPath: require.resolve('./formate'),
  });

  api.writeFile(`${paths.absTmpPath}/mdf-nest.ts`, prettierFormat(content));
}
