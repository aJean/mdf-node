"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@mdfjs/utils");

var _child_process = require("child_process");

var _treeKill = _interopRequireDefault(require("tree-kill"));

var _typescript = _interopRequireDefault(require("typescript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeRunner {
  constructor(opts) {
    this.opts = opts;
  }

  run() {
    const _this$opts = this.opts,
          watchPath = _this$opts.watchPath,
          tsconfigPath = _this$opts.tsconfigPath;
    const files = (0, _utils.globFind)(watchPath);

    const host = _typescript.default.createWatchCompilerHost(tsconfigPath, compilerOptions, _typescript.default.sys);

    const onSuccess = this.createOnSuccessHook();
    const origCreateProgram = host.createProgram;

    host.createProgram = function (rootNames, options, host, oldProgram) {
      return origCreateProgram(files, options, host, oldProgram);
    };

    const origStatusReporter = _typescript.default.createWatchStatusReporter(_typescript.default.sys, true);

    host.onWatchStatusChange = this.createStatusReporter(origStatusReporter, onSuccess);

    _typescript.default.createWatchProgram(host);
  }
  /**
   * 加入编译成功状态处理
   */


  createStatusReporter(statusReporter, onSuccess) {
    return function (diagnostic, ...args) {
      const text = diagnostic && diagnostic.messageText;
      const noErrors = '0 errors';

      if (text && text.includes && text.includes(noErrors) && onSuccess) {
        onSuccess();
      }

      return statusReporter.call(this, diagnostic, ...args);
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
      }
    };
  }

  spawnChildProcess() {
    const processArgs = [`dist/server/main.js`];
    return (0, _child_process.spawn)('node', processArgs, {
      stdio: 'inherit',
      shell: true
    });
  }

} // 覆盖 tsconfig 里面的参数


exports.default = NodeRunner;
const compilerOptions = {
  outDir: 'dist/server',
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