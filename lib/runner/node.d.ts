/// <reference types="node" />
import { IApi } from '@mdfjs/types';
import ts from 'typescript';
import { ITscPaths } from '../utils';
/**
 * @file node runner
 */
export declare type NodeRunnerOpts = {
    api: IApi;
    tsconfigPath: string;
};
export default class NodeRunner {
    tsconfigPath: string;
    tscPaths: ITscPaths;
    constructor(opts: NodeRunnerOpts);
    run(): void;
    /**
     * 加入编译成功状态处理
     */
    createStatusReporter(statusReporter: (diagnostic: ts.Diagnostic, ...args: any[]) => any, onSuccess?: () => void): (this: any, diagnostic: ts.Diagnostic, ...args: any[]) => any;
    createOnSuccessHook(): () => void;
    spawnChildProcess(): import("child_process").ChildProcess;
}
