import ts from 'typescript';
import { IApi } from '@mdfjs/types';
import { globFind, genServerPath } from '@mdfjs/utils';

/**
 * @file 构建产物
 * @todo 需要清除 dist + client build
 */

export default function (api: IApi) {
  api.registerCommand({
    name: 'build',
    async fn() {
      // client build

      const files = globFind(`${api.cwd}/${genServerPath(api)}/**.ts`);

      const program = ts.createProgram(files, {
        outDir: 'dist/server',
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
