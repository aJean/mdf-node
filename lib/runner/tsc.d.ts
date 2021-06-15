/// <reference types="node" />
import { IApi } from '@mdfjs/types';
import ts from 'typescript';
import { ITscPaths } from '../utils';
/**
 * @file mdf-node tsc runner
 */
export declare type NodeRunnerOpts = {
    api: IApi;
    tsconfigPath: string;
};
export default class NodeRunner {
    tsconfigPath: string;
    tscPaths: ITscPaths;
    api: IApi;
    constructor(opts: NodeRunnerOpts);
    run(): void;
    /**
     * 加入编译状态处理
     */
    createStatusReporter(statusReporter: (diagnostic: ts.Diagnostic, ...args: any[]) => any, onSuccess?: () => void): (this: any, diagnostic: ts.Diagnostic, ...args: any[]) => void;
    createOnSuccessHook(): () => void;
    /**
     * 启动 main 进程
     */
    spawnChildProcess(): import("child_process").ChildProcess;
}
