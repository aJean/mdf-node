import ts from 'typescript';
import { IApi } from '@mdfjs/types';
import { globFind } from '@mdfjs/utils';
import { genTscPaths } from './utils';

/**
 * @file 构建产物
 * @todo 需要清除 dist + client build
 */

export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      const tscPaths = genTscPaths(api);
      const rimraf = require('rimraf');

      rimraf.sync(tscPaths.absOutDir);

      // 需要实现 plugin 的 build 来处理 client 部分, 当然也要判断 project

      // server build
      const files = globFind(tscPaths.watchFile);
      const program = ts.createProgram(files, {
        outDir: tscPaths.outDir,
        allowJs: true,
        noImplicitReturns: true,
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        experimentalDecorators: true,
        forceConsistentCasingInFileNames: true,
        suppressImplicitAnyIndexErrors: true,
        skipLibCheck: true,
        declaration: false,
      });

      program.emit();
    },
  });
}
