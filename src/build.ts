import { IApi } from '@mdfjs/types';
import { errorPrint, Spinner } from '@mdfjs/utils';
import BrowserBuilder from './builder/browser';
import RollupBuilder from './builder/rollup';
import createNestEntry from './mdf/mdf';

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */

const rimraf = require('rimraf');
export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      const { project } = api.getConfig();
      // @todo 与 webpack process 冲突
      const spinner = new Spinner({ text: 'start to build' }).info();

      // 清空 dist
      rimraf.sync('dist');
      // 创建 node 入口
      createNestEntry(api);

      // 混合项目需要先构建 client
      if (project.type === 'hybrid') {
        BrowserBuilder(api).then(
          () => {
            spinner.start({ text: 'build node files' });
            api.invokePlugin({
              key: 'processDone',
              type: api.PluginType.flush,
            });

            RollupBuilder(api)
              .then(() => spinner.succeed({ text: 'build success' }))
              .catch((e) => doError(e));
          },
          (e: any) => errorPrint(e),
        );
      } else {
        RollupBuilder(api)
          .then(() => spinner.succeed({ text: 'build success' }))
          .catch((e) => doError(e));
      }

      /**
       * error 要删除 dist
       */
      function doError(e) {
        spinner.fail({ text: 'build error' });
        console.error(e);
        rimraf.sync('dist');
      }
    },
  });
}
