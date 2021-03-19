import ts from 'typescript';
import { IApi } from '@mdfjs/types';
import { globFind } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file 用于构建 node 代码，ts 是同步执行
 */

export default function (api: IApi) {
  const tscPaths = genTscPaths(api);
  const files = globFind(tscPaths.watchFile);
  const program = ts.createProgram(files, {
    outDir: tscPaths.outDir,
    allowJs: true,
    noImplicitReturns: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    forceConsistentCasingInFileNames: true,
    suppressImplicitAnyIndexErrors: true,
    skipLibCheck: true,
    declaration: false,
  });

  const result = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
  const errors = [];

  diagnostics.forEach((diagnostic) => {
    const file = diagnostic.file;

    if (file) {
      const { line, character } = file.getLineAndCharacterOfPosition(diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      errors.push(`${file.fileName} (${line + 1}, ${character + 1}): ${message}`);
    } else {
      errors.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  return Promise.resolve(errors.length ? errors : null);
}
