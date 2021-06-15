import { IApi } from '@mdfjs/types';
import ts from 'typescript';
import * as rollup from 'rollup';
import replace from '@rollup/plugin-replace';
import tsplugin from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import { genTscPaths } from '../utils';

/**
 * @file rollup node builder
 */

export default async function (api: IApi) {
  const { entry, buildDir } = genTscPaths(api);
  const compilerOptions = {
    allowJs: true,
    noImplicitReturns: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    forceConsistentCasingInFileNames: true,
    suppressImplicitAnyIndexErrors: true,
    skipLibCheck: true,
    declaration: false,
  };

  const config: any = {
    input: entry,
    output: {
      file: `${api.cwd}/${buildDir}/mdf-nest.js`,
      format: 'cjs',
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.MDF_ENV': JSON.stringify(process.env.MDF_ENV || 'prod'),
      }),
      tsplugin(compilerOptions),
      // 忽略 builtins & deps
      externals({ packagePath: `${api.cwd}/package.json`, deps: true, devDeps: true }),
      commonjs(),
    ],
  };

  const bundle = await rollup.rollup(config);
  return bundle.write(config.output);
}
