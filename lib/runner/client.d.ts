import { IApi } from '@mdfjs/types';
/**
 * @file client react runner
 */
export declare type ClientRunnerOpts = {
    api: IApi;
    configPath?: string;
};
export default class ClientRunner {
    api: IApi;
    configPath?: string;
    constructor(opts: ClientRunnerOpts);
    run(): any;
    startServer(): void;
    /**
     * 监控变化
     */
    initWatchers(server: any): void;
}
