import { IApi } from '@mdfjs/types';
import ora from 'ora';
import Bundler from '@mdfjs/bundler-webpack';
import { DevServer } from '@mdfjs/server';
import { watch, chalkPrints, genAppPath } from '@mdfjs/utils';
import { resolve as resolvePath } from 'path';

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

  async run() {
    const api = this.api;
    const { paths } = api;
    const spinner = ora({
      text: 'generate mdf\n',
      spinner: 'dots',
    }).start();

    api.makeDir(paths.absTmpPath);
    await this.generateCode();

    spinner.text = 'generate success';
    spinner.color = 'yellow';
    spinner.succeed();

    this.startServer();
  }

  startServer() {
    const api = this.api;
    const { PluginType } = api;
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
    const { webpackCompiler, serverOpts } = bundler.setupDev();
    const server = new DevServer({
      webpackCompiler,
      serverOpts,
      onFinish() {
        api.invokePlugin({
          key: 'processDone',
          type: PluginType.flush,
        });
      },
    });

    server.start();

    // important watchs
    const unwatchs: any = [];
    const unwatchConfig = watch({
      path: resolvePath('./config'),
      useMemo: true,
      onChange: function(type, path) {
        chalkPrints([[`${type}: `, 'green'], ` ${path}`]);
        chalkPrints([[`restart: `, 'yellow'], ` mdf server`]);
        unwatchs.forEach((unwatch: Function) => unwatch());

        server.close();
        process.send!({ type: 'RESTART' });
      },
    });

    // 变化比较快，没必要提示了
    const unwatchApp = watch({
      path: resolvePath(genAppPath(api)),
      onChange: () => this.generateCode()
    });

    unwatchs.push(unwatchConfig, unwatchApp);
  }

  generateCode(): Promise<any> {
    const api = this.api;

    return api.invokePlugin({ key: 'codeGenerate', type: api.PluginType.event });
  }
}
