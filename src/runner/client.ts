import { IApi } from '@mdfjs/types';
import Bundler from '@mdfjs/bundler-webpack';
import { startDevServer } from '@mdfjs/server';
import { watch, chalkPrints, genAppPath, Spinner } from '@mdfjs/utils';

/**
 * @file client react runner
 */

export type ClientRunnerOpts = {
  api: IApi;
  configPath?: string;
};

export default class ClientRunner {
  api: IApi;
  configPath?: string;

  constructor(opts: ClientRunnerOpts) {
    this.api = opts.api;
  }

  run() {
    const api = this.api;
    const { paths } = api;
    const spinner = new Spinner({ text: 'generate mdf\n', graph: 'dots' }).start();

    api.makeDir(paths.absTmpPath);
    return api.codeGenerate().then(() => {
      spinner.succeed({ text: 'generate success' });
      this.startServer();
    });
  }

  startServer() {
    const api = this.api;
    const { PluginType, cwd } = api;
    const config = api.getConfig();

    // instance
    config!.isDev = true;
    const bundler = new Bundler(config);

    bundler.generateConfig({
      changeUserConfig(userConfig: any) {
        return api.invokePlugin({
          type: PluginType.modify,
          key: 'userConfig',
          initValue: userConfig,
        });
      },

      changeWebpackConfig(chain: any) {
        return api.invokePlugin({
          type: PluginType.event,
          key: 'chainWebpack',
          args: [chain],
        });
      },

      changeBundleConfig(bundleConfig: any) {
        return api.invokePlugin({
          type: PluginType.modify,
          key: 'bundleConfig',
          initValue: bundleConfig,
        });
      },
    });

    api.invokePlugin({
      key: 'onBuildComplete',
      type: PluginType.event,
    });

    // dev pipeline
    const { compiler, opts } = bundler.setupDev();
    startDevServer(compiler, opts).then((res: any) => {
      this.initWatchers(res.server);

      // 必须加个延时，要在 webpack 之后输出
      setTimeout(function () {
        api.invokePlugin({ key: 'processDone', type: PluginType.flush });

        chalkPrints([[`\nsuccess: `, 'green'], ` mdf server`]);
        console.log(` - ${res.msg}`);
      }, 800);
    });
  }

  /**
   * 监控变化
   */
  initWatchers(server: any) {
    const api = this.api;

    // important watchs
    const unwatchs: any = [];
    const unwatchConfig = watch({
      path: `${api.cwd}/config`,
      useMemo: true,
      onChange: function (type, path) {
        chalkPrints([[`${type}: `, 'green'], ` ${path}`]);
        chalkPrints([[`restart: `, 'yellow'], ` mdf server`]);
        unwatchs.forEach((unwatch: Function) => unwatch());

        server.close();
        process.send!({ type: 'RESTART' });
      },
    });

    // 变化比较快，没必要提示了
    const unwatchApp = watch({
      path: `${api.cwd}/${genAppPath(api)}`,
      onChange: () => api.codeGenerate(),
    });

    unwatchs.push(unwatchConfig, unwatchApp);
  }
}
