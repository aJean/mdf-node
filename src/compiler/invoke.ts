import Module from 'module';
import * as tsnode from 'ts-node';

/**
 * @file 执行 node file, REPL & eval mode
 */

export const compilerOptions = {
  allowJs: true,
  noImplicitReturns: true,
  target: 'ES2015',
  module: 'CommonJS',
  moduleResolution: 'node',
  experimentalDecorators: true,
  forceConsistentCasingInFileNames: true,
  suppressImplicitAnyIndexErrors: true,
  skipLibCheck: true,
  declaration: false,
};

export default function (scriptPath: string) {
  // 添加 require.extensions['ts'] 方法
  tsnode.register({
    compilerOptions: compilerOptions,
  });

  process.argv = [process.argv[0], scriptPath];
  
  // Module._load(process.argv[1])
  Module.runMain();
}
