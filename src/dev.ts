import { IApi } from '@mdfjs/types';
import { rmrf } from '@mdfjs/utils';
import TscRunner from './runner/tsc';
import ClientRunner from './runner/client';
import createNestEntry from './mdf/mdf';

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
      rmrf(api.paths.absTmpPath);
      // 启动 server 部分
      createNestEntry(api);
      const runner = new TscRunner({ api, tsconfigPath: require.resolve('../tsconfig.json') });

      runner.run();
    },
  });
}

/**
 * 多模启动
 */
async function multiPipe(api: IApi, args: any) {
  let runner;

  if (args.node) {
    createNestEntry(api);
    runner = new TscRunner({
      api,
      tsconfigPath: require.resolve('../tsconfig.json'),
    });

    runner.run();
  } else {
    runner = new ClientRunner({ api });
    await runner.run();
  }
}
