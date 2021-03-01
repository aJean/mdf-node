import webpack from 'webpack';
import Chain from 'webpack-chain';
import { resolve as resolvePath } from 'path';
import { ignoreConfig } from './pluginConfigs';

/**
 * @file 编译 nest.js
 */

export default function getChain(userConfig: any) {
  const { isDev } = userConfig;
  const chain = new Chain();

  chain.target('node').mode(isDev ? 'development' : 'production');

  // entry
  chain.entry('main').add(resolvePath('src/server/main.ts'));

  // output
  chain.output.path(resolvePath('dist')).filename('main.js');

  // extensions
  chain.resolve.extensions.clear().merge(['.ts', '.js']);

  // ts
  chain.module
    .rule('nodeJs')
    .test(/\.ts$/)
    .exclude.add(/node_modules/)
    .end()
    .use('tsLoader')
    .loader(require.resolve('ts-loader'))
    .options({ onlyCompileBundledFiles: true });

  // plugins
  chain.plugin('ignorePlugin').use(new webpack.IgnorePlugin(ignoreConfig));

  return chain;
}

/**
 * @deprecated 没必要使用 webpack
 */
function runWebpack(userConfig: any) {
  const compiler = webpack(getChain(userConfig).toConfig());

  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.toString('errors-only'));
    }
  });
}