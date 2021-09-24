import { IApi } from '@mdfjs/types';
import { watch, globFind, chalkPrints, rmrf } from '@mdfjs/utils';
import { spawn } from 'child_process';
import killProcess from 'tree-kill';
import ts from 'typescript';
import { ITscPaths, genTscPaths, cleanConsole } from '../utils';

/**
 * @file mdf-node tsc runner
 */

export type NodeRunnerOpts = {
  api: IApi;
  tsconfigPath: string;
};

export default class NodeRunner {
  tsconfigPath: string;
  tscPaths: ITscPaths;
  api: IApi;

  constructor(opts: NodeRunnerOpts) {
    this.tsconfigPath = opts.tsconfigPath;
    this.tscPaths = genTscPaths(opts.api);
    this.api = opts.api;
  }

  run() {
    const { entry, devDir } = this.tscPaths;
    const files = globFind(entry);
    // 删除上次的结果
    rmrf(devDir);
    cleanConsole()

    // 覆盖 tsconfig 里面的参数
    const compilerOptions = {
      outDir: devDir,
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
    const host = ts.createWatchCompilerHost(this.tsconfigPath, compilerOptions, ts.sys);
    const onSuccess = this.createOnSuccessHook();

    // 保留 files 变量
    const origCreateProgram = host.createProgram;
    host.createProgram = function (rootNames, options, host, oldProgram) {
      return origCreateProgram(files, options, host, oldProgram);
    };

    const origStatusReporter = (ts as any).createWatchStatusReporter(ts.sys, true);
    host.onWatchStatusChange = this.createStatusReporter(origStatusReporter, onSuccess);

    ts.createWatchProgram(host);
  }

  /**
   * 加入编译状态处理
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

      statusReporter.call(this, diagnostic, ...args);
    };
  }

  /**
   * tsc watch 进程管理
   */
  createOnSuccessHook() {
    const that = this;
    let childProcessRef: any;

    // 当前进程结束要清除紫金城
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

      // 监控 config 目录
      const unwatchConfig = watch({
        path: `${that.api.cwd}/config`,
        useMemo: true,
        onChange: function (type, path) {
          chalkPrints([[`${type}: `, 'green'], ` ${path}`]);
          chalkPrints([[`restart: `, 'yellow'], ` mdf server pid: ${childProcessRef.pid}`]);

          unwatchConfig();
          killProcess(childProcessRef.pid, () => {
            // see mdfjs/mdf/cli/fork
            process.send!({ type: 'RESTART' });
          });
        },
      });
    };
  }

  /**
   * 启动 main 进程
   */
  spawnChildProcess() {
    const processArgs = [this.tscPaths.setup];
    return spawn('node', processArgs, {
      stdio: 'inherit',
      shell: true,
    });
  }
}
