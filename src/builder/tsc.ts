import ts from 'typescript';
import { IApi } from '@mdfjs/types';
import { globFind } from '@mdfjs/utils';
import { genTscPaths } from '../utils';

/**
 * @file 使用 typescript 构建源码
 */

export default function (api: IApi) {
  const { entry, buildDir } = genTscPaths(api);
  const files = globFind(entry); // .tmp/mdf-nest.ts
  const program = ts.createProgram(files, {
    outDir: buildDir,
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

  transformDefine([`${api.cwd}/${buildDir}/shared/utils.js`], api);

  return Promise.resolve(errors.length ? errors : null);
}

/**
 * 等同 define plugin
 * TODO: 是否要对每个文件都 transform，但需要依赖 ts 的事件触发
 */
function transformDefine(files: string[], api: IApi) {
  const babel = require('@babel/core');
  const opts = {
    cwd: __dirname,
    plugins: [
      [
        'transform-inline-environment-variables',
        {
          include: ['MDF_ENV'],
        },
      ],
    ],
  };

  try {
    files.forEach((file) => {
      const data = babel.transformFileSync(file, opts);
      api.writeFile(file, data.code);
    });
  } catch (e) {}
}
