/**
 * @file utils
 */

export type ITscPaths = {
  setup: string;
  watchFile: string;
  appFile: string;
  devDir: string; // 本地构建
  outDir: string; // 线上打包
};

/**
 * 根据项目类型生产匹配的目录
 */
export function genTscPaths(api: any): ITscPaths {
  const { project } = api.getConfig();
  // 所有项目的 node 代码产出目录都是 server
  const paths = {
    setup: '.tmp/server/.tmp/mdf-nest.js',
    watchFile: `${api.paths.absTmpPath}/mdf-nest.ts`,
    appFile: 'src/server/app.module',
    devDir: '.tmp/server',
    outDir: 'dist/server',
  };

  switch (project.type) {
    case 'hybrid':
      return paths;
    default:
      paths.appFile = 'src/app.module';
      return paths;
  }
}

/**
 * 安全获取对象属性，找不到就返回 undefined
 */
export function safeGetProperty(path, target) {
  const tokens = path.split('.');
  let result = target;

  while (tokens.length) {
    const token = tokens.shift();
    if (result[token]) {
      result = result[token];
    } else {
      return undefined;
    }
  }

  return result;
}
