import ora from 'ora';
import { IApi } from '@mdfjs/types';
import { genTscPaths } from './utils';
import { errorPrint, chalkPrints } from '@mdfjs/utils';
import ClientBuilder from './builder/client';
import NodeBuilder from './builder/node';

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */

export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      const { project } = api.getConfig();
      const tscPaths = genTscPaths(api);
      // @todo 与 webpack process 冲突
      const spinner = ora().info('start to build');

      // 清空 dist
      require('rimraf').sync(tscPaths.absOutDir);

      // 混合项目需要先构建 client
      if (project.type === 'hybrid') {
        ClientBuilder(api).then(
          () => {
            spinner.start('build node files');
            api.invokePlugin({
              key: 'processDone',
              type: api.PluginType.flush,
            });

            NodeBuilder(api).then((errors) => finish(errors, spinner));
          },
          (e: any) => errorPrint(e),
        );
      } else {
        NodeBuilder(api).then((errors) => finish(errors, spinner));
      }
    },
  });
}

function finish(errors, spinner) {
  if (errors) {
    spinner.color = 'red';
    spinner.fail('build error');

    chalkPrints([[`error: `, 'red'], errors[0]]);
  } else {
    spinner.color = 'yellow';
    spinner.succeed('build success');
  }
}
