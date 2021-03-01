import { globFind } from '@mdfjs/utils';
import { spawn } from 'child_process';
import killProcess from 'tree-kill';
import ts from 'typescript';

/**
 * @file node runner
 */

export type NodeRunnerOpts = {
  watchPath: string;
  main: string;
  tsconfigPath: string;
};

export default class NodeRunner {
  opts: NodeRunnerOpts;

  constructor(opts: NodeRunnerOpts) {
    this.opts = opts;
  }

  run() {
    const { watchPath, tsconfigPath } = this.opts;
    const files = globFind(watchPath);
    const host = ts.createWatchCompilerHost(tsconfigPath, compilerOptions, ts.sys);
    const onSuccess = this.createOnSuccessHook();

    const origCreateProgram = host.createProgram;
    host.createProgram = function (rootNames, options, host, oldProgram) {
      return origCreateProgram(files, options, host, oldProgram);
    };

    const origStatusReporter = (ts as any).createWatchStatusReporter(ts.sys, true);
    host.onWatchStatusChange = this.createStatusReporter(origStatusReporter, onSuccess);

    ts.createWatchProgram(host);
  }

  /**
   * 加入编译成功状态处理
   */
  createStatusReporter(
    statusReporter: (diagnostic: ts.Diagnostic, ...args: any[]) => any,
    onSuccess?: () => void,
  ) {
    return function (this: any, diagnostic: ts.Diagnostic, ...args: any[]) {
      const text = (diagnostic && diagnostic.messageText) as string;
      const noErrors = '0 errors';

      if (text && text.includes && text.includes(noErrors) && onSuccess) {
        onSuccess();
      }
      return statusReporter.call(this, diagnostic, ...args);
    };
  }

  createOnSuccessHook() {
    const that = this;
    let childProcessRef: any;

    process.on('exit', () => childProcessRef && killProcess(childProcessRef.pid));

    return function () {
      if (childProcessRef) {
        childProcessRef.removeAllListeners('exit');
        childProcessRef.on('exit', () => {
          childProcessRef = that.spawnChildProcess();
          childProcessRef.on('exit', () => (childProcessRef = undefined));
        });

        childProcessRef.stdin && childProcessRef.stdin.pause();
        killProcess(childProcessRef.pid);
      } else {
        childProcessRef = that.spawnChildProcess();
        childProcessRef.on('exit', () => (childProcessRef = undefined));
      }
    };
  }

  spawnChildProcess() {
    const processArgs = [`dist/server/main.js`];

    return spawn('node', processArgs, {
      stdio: 'inherit',
      shell: true,
    });
  }
}

// 覆盖 tsconfig 里面的参数
const compilerOptions = {
  outDir: 'dist/server',
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
};
