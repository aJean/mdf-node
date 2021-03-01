/// <reference types="node" />
import ts from 'typescript';
/**
 * @file node runner
 */
export declare type NodeRunnerOpts = {
    watchPath: string;
    main: string;
    tsconfigPath: string;
};
export default class NodeRunner {
    opts: NodeRunnerOpts;
    constructor(opts: NodeRunnerOpts);
    run(): void;
    /**
     * 加入编译成功状态处理
     */
    createStatusReporter(statusReporter: (diagnostic: ts.Diagnostic, ...args: any[]) => any, onSuccess?: () => void): (this: any, diagnostic: ts.Diagnostic, ...args: any[]) => any;
    createOnSuccessHook(): () => void;
    spawnChildProcess(): import("child_process").ChildProcess;
}
