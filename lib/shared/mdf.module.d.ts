import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * @file mdf 公共服务
 */
export declare class MdfService {
    protected httpService: HttpService;
    protected configService: ConfigService;
    constructor(httpService: HttpService, configService: ConfigService);
    http(): HttpService;
    config(): ConfigService<Record<string, any>>;
    getConfig(key: string): any;
}
export declare type MdfModuleOptions = {
    timeout: number;
    envs: string[];
    serve?: any;
};
export declare class MdfModule {
    static forRoot(opts: MdfModuleOptions): any;
}
