import { IApi } from '@mdfjs/types';
import { Spinner, rmrf } from '@mdfjs/utils';
import ClientBuilder from './builder/client';
import RollupBuilder from './builder/rollup';
import createNestEntry from './mdf/mdf';

/**
 * @file 重写 mdfjs 的 build，构建 node 项目
 */

export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      const { project } = api.getConfig();
      // @todo 与 webpack process 冲突
      const spinner = new Spinner({ text: 'start to build' }).info();

      // 清空 dist
      rmrf('dist');
      // 创建 node 入口
      createNestEntry(api);

      switch (project.type) {
        // 混合项目需要先构建 client
        case 'hybrid':
          await ClientBuilder(api);
          spinner.start({ text: 'build node files' });
          api.invokePlugin({ key: 'processDone', type: api.PluginType.flush });

          await RollupBuilder(api);
          spinner.succeed({ text: 'build success' });
          break;
        default:
          await RollupBuilder(api);
          spinner.succeed({ text: 'build success' });
      }

      process.exit(0);
    },
  });
}
