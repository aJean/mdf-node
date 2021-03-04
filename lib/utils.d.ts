/**
 * @file utils
 */
export declare type ITscPaths = {
    watchFile: string;
    startFile: string;
    outDir: string;
    absOutDir: string;
};
export declare function genTscPaths(api: any): ITscPaths;
