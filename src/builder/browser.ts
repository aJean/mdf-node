import { IApi } from '@mdfjs/types';
import Bundler from '@mdfjs/bundler-webpack';

/**
 * @file 根据规范要把 client 文件全部打包成 static
 */

export default async function (api: IApi) {
  const { paths, PluginType } = api;
  const config = api.getConfig();

  api.makeDir(paths.absTmpPath);
  await generateCode(api);

  // instance
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

  return bundler.build();
}

function generateCode(api: IApi): Promise<any> {
  return api.invokePlugin({ key: 'codeGenerate', type: api.PluginType.event });
}
