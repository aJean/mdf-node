/**
 * @file utils
 */

export type ITscPaths = {
  watchFile: string;
  startFile: string; // node 启动文件
  mainFile: string; // node main 文件
  outDir: string;
  absOutDir: string; // rimraf 删除
};

/**
 * 根据项目类型生产匹配的目录
 */
export function genTscPaths(api: any): ITscPaths {
  const { project } = api.getConfig();
  // 所有项目的 node 代码产出目录都是 server
  const paths = {
    watchFile: `${api.cwd}/src/server/**.ts`,
    startFile: 'dist/server/main.js',
    mainFile: 'server/main.ts',
    outDir: 'dist/server',
    absOutDir: `${api.cwd}/dist`,
  };

  switch (project.type) {
    case 'hybrid':
      return paths;
    default:
      paths.watchFile = `${api.cwd}/src/**.ts`;
      paths.mainFile = 'main.ts';

      return paths;
  }
}
