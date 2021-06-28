"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@mdfjs/utils");

var _child_process = require("child_process");

var _treeKill = _interopRequireDefault(require("tree-kill"));

var _typescript = _interopRequireDefault(require("typescript"));

var _utils2 = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeRunner {
  constructor(opts) {
    this.tsconfigPath = void 0;
    this.tscPaths = void 0;
    this.api = void 0;
    this.tsconfigPath = opts.tsconfigPath;
    this.tscPaths = (0, _utils2.genTscPaths)(opts.api);
    this.api = opts.api;
  }

  run() {
    const _this$tscPaths = this.tscPaths,
          entry = _this$tscPaths.entry,
          devDir = _this$tscPaths.devDir;
    const files = (0, _utils.globFind)(entry); // 删除上次的结果

    (0, _utils.rmrf)(devDir); // 覆盖 tsconfig 里面的参数

    const compilerOptions = {
      outDir: devDir,
      allowJs: true,
      noImplicitReturns: true,
      target: _typescript.default.ScriptTarget.ES2017,
      module: _typescript.default.ModuleKind.CommonJS,
      moduleResolution: _typescript.default.ModuleResolutionKind.NodeJs,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      forceConsistentCasingInFileNames: true,
      suppressImplicitAnyIndexErrors: true,
      skipLibCheck: true,
      declaration: false
    };

    const host = _typescript.default.createWatchCompilerHost(this.tsconfigPath, compilerOptions, _typescript.default.sys);

    const onSuccess = this.createOnSuccessHook(); // 保留 files 变量

    const origCreateProgram = host.createProgram;

    host.createProgram = function (rootNames, options, host, oldProgram) {
      return origCreateProgram(files, options, host, oldProgram);
    };

    const origStatusReporter = _typescript.default.createWatchStatusReporter(_typescript.default.sys, true);

    host.onWatchStatusChange = this.createStatusReporter(origStatusReporter, onSuccess);

    _typescript.default.createWatchProgram(host);
  }
  /**
   * 加入编译状态处理
   */


  createStatusReporter(statusReporter, onSuccess) {
    return function (diagnostic, ...args) {
      const text = diagnostic && diagnostic.messageText;
      const noErrors = '0 errors';

      if (text && text.includes && text.includes(noErrors) && onSuccess) {
        onSuccess();
      }

      statusReporter.call(this, diagnostic, ...args);
    };
  }

  createOnSuccessHook() {
    const that = this;
    let childProcessRef;
    process.on('exit', () => childProcessRef && (0, _treeKill.default)(childProcessRef.pid));
    return function () {
      if (childProcessRef) {
        childProcessRef.removeAllListeners('exit');
        childProcessRef.on('exit', () => {
          childProcessRef = that.spawnChildProcess();
          childProcessRef.on('exit', () => childProcessRef = undefined);
        });
        childProcessRef.stdin && childProcessRef.stdin.pause();
        (0, _treeKill.default)(childProcessRef.pid);
      } else {
        childProcessRef = that.spawnChildProcess();
        childProcessRef.on('exit', () => childProcessRef = undefined);
      } // 监控 config 目录


      const unwatchConfig = (0, _utils.watch)({
        path: `${that.api.cwd}/config`,
        useMemo: true,
        onChange: function onChange(type, path) {
          (0, _utils.chalkPrints)([[`${type}: `, 'green'], ` ${path}`]);
          (0, _utils.chalkPrints)([[`restart: `, 'yellow'], ` mdf server pid: ${childProcessRef.pid}`]);
          unwatchConfig();
          (0, _treeKill.default)(childProcessRef.pid, () => {
            // see mdfjs/mdf/cli/fork
            process.send({
              type: 'RESTART'
            });
          });
        }
      });
    };
  }
  /**
   * 启动 main 进程
   */


  spawnChildProcess() {
    const processArgs = [this.tscPaths.setup];
    return (0, _child_process.spawn)('node', processArgs, {
      stdio: 'inherit',
      shell: true
    });
  }

}

exports.default = NodeRunner;