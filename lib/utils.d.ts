/**
 * @file utils
 */
export declare type ITscPaths = {
    watchFile: string;
    startFile: string;
    mainFile: string;
    outDir: string;
    absOutDir: string;
};
/**
 * 根据项目类型生产匹配的目录
 */
export declare function genTscPaths(api: any): ITscPaths;
