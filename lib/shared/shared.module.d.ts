import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * @file shared 公共服务
 */
export declare class SharedService {
    protected httpService: HttpService;
    protected configService: ConfigService;
    constructor(httpService: HttpService, configService: ConfigService);
    http(): HttpService;
    config(): ConfigService<Record<string, any>>;
    getConfig(key: string): any;
}
export declare type MdfModuleOptions = {
    timeout?: number;
    uselog?: boolean;
    serve?: any;
};
export declare class SharedModule {
    /**
     * 必须使用动态导入，否则无法拿到正确的 env 信息
     */
    static forRoot(opts?: MdfModuleOptions): any;
}
