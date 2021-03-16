import { IApi } from '@mdfjs/types';
import { genTscPaths } from './utils';
import { errorPrint, chalkPrints, Spinner } from '@mdfjs/utils';
import ClientBuilder from './builder/client';
import NodeBuilder from './builder/node';
import createNestEntry from './nestjs/main';

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */

const rimraf = require('rimraf');
export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      const { project } = api.getConfig();
      const tscPaths = genTscPaths(api);
      // @todo 与 webpack process 冲突
      const spinner = new Spinner({ text: 'start to build' }).info();

      // 清空 dist
      rimraf.sync(tscPaths.absOutDir);
      // 创建 node 入口
      createNestEntry(api);

      // 混合项目需要先构建 client
      if (project.type === 'hybrid') {
        ClientBuilder(api).then(
          () => {
            spinner.start({ text: 'build node files' });
            api.invokePlugin({
              key: 'processDone',
              type: api.PluginType.flush,
            });

            NodeBuilder(api).then((errors) => finish(errors));
          },
          (e: any) => errorPrint(e),
        );
      } else {
        NodeBuilder(api).then((errors) => finish(errors));
      }

      /**
       * error 要删除 dist
       */
      function finish(errors) {
        if (errors) {
          spinner.fail({ text: 'build error' });
          rimraf.sync(tscPaths.absOutDir);
          chalkPrints([[`error: `, 'red'], errors[0]]);
        } else {
          spinner.succeed({ text: 'build success' });
        }
      }
    },
  });
}
