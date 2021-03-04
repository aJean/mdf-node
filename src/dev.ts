import { IApi } from '@mdfjs/types';
import { genServerPath } from '@mdfjs/utils';
import NodeRunner from './runner/node';
import ClientRunner from './runner/client';

/**
 * @file 重写 mdfjs 的 dev
 *       命令上区分 client 和 server，毕竟都需要 stdout，所以启两个进程也比较合理
 *       client 支持 react、vue、angular ?
 *       server 默认使用 nest.js
 */

export default function (api: IApi) {
  api.registerCommand({
    name: 'dev',
    async fn(args) {
      let runner;

      // 启动 server 部分
      if (args.node) {
        runner = new NodeRunner({
          watchPath: `${api.cwd}/${genServerPath(api)}/**.ts`,
          tsconfigPath: require.resolve('../tsconfig.json'),
          main: 'dist/server/main.js',
        });

        runner.run();
      } else {
        runner = new ClientRunner({ api });
        runner.run();
      }
    },
  });
}
