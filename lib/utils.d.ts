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
 * TODO: main.ts 作为唯一 root 也生成到 .tmp 目录中，避免干扰用户代码
 */
export declare function genTscPaths(api: any): ITscPaths;
/**
 * 安全获取对象属性，找不到就返回 undefined
 */
export declare function safeGetProperty(path: any, target: any): any;
