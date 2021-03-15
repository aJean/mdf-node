import { IApi } from '@mdfjs/types';
import { join } from 'path';
import { prettierFormat } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file 生产 node server main 入口
 */

export default function (api: IApi) {
  const { paths, Mustache } = api;
  const { project, envs } = api.getConfig();
  const { mainFile } = genTscPaths(api);
  const mainTpl = api.getFile(join(__dirname, './main.tpl'));
  // 生成 main.ts 内容
  const mainContent = Mustache.render(mainTpl, {
    port: project.port || 3001,
    envs,
  });

  api.writeFile(`${paths.absSrcPath}/${mainFile}`, prettierFormat(mainContent));
}
