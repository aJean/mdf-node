/**
 * @file utils
 */

export type ITscPaths = {
  watchFile: string;
  startFile: string; // node 启动文件
  outDir: string;
  absOutDir: string; // rimraf 删除
}

export function genTscPaths(api: any): ITscPaths {
  const { project } = api.getConfig();

  switch (project.type) {
    case 'hybrid':
      return {
        watchFile: `${api.cwd}/src/server/**.ts`,
        startFile: 'dist/server/main.js',
        outDir: 'dist/server',
        absOutDir: `${api.cwd}/dist`,
      };
    default:
      return {
        watchFile: `${api.cwd}/src/**.ts`,
        startFile: 'dist/main.js',
        outDir: 'dist',
        absOutDir: `${api.cwd}/dist`,
      };
  }
}
