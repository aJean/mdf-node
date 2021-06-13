/**
 * @file utils
 */

export type ITscPaths = {
  watchFile: string;
  startFile: string;
  appFile: string;
  outDir: string;
  absOutDir: string;
};

/**
 * 根据项目类型生产匹配的目录
 */
export function genTscPaths(api: any): ITscPaths {
  const { project } = api.getConfig();
  // 所有项目的 node 代码产出目录都是 server
  const paths = {
    watchFile: `${api.paths.absTmpPath}/mdf-nest.ts`,
    startFile: 'dist/server/.tmp/mdf-nest.js',
    appFile: 'src/server/app.module',
    outDir: 'dist/server',
    // 每次构建先删除
    absOutDir: `${api.cwd}/dist`,
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
