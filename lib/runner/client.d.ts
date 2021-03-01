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
    run(): Promise<void>;
    startServer(): void;
    generateCode(): Promise<any>;
}
