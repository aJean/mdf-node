import { Observable } from 'rxjs';
import { MongoClient } from 'mongodb';
import { MdfService } from './mdf.module';
/**
 * @file app service
 */
export declare type Opts_Rpc = {
    path?: string;
    method?: string;
    data?: any;
    headers?: any;
};
export declare type Http_Rpc = {
    url: string;
    method?: string;
    data?: any;
    config?: any;
};
export declare abstract class AppService {
    protected mdfService: MdfService;
    type: string;
    constructor(type: string, mdfService: MdfService);
    /**
     * 环境变量
     */
    getEnv(key: string): any;
    /**
     * 获取 mongo connect
     */
    getMongo(): Promise<MongoClient>;
    /**
     * 发送 rpc 请求, 熔断、限流都放到这里处理
     */
    rpc(opts: Opts_Rpc): Observable<any>;
    /**
     * 发送普通 http 请求
     */
    send(opts: Http_Rpc): Observable<import("axios").AxiosResponse<any>>;
    /**
     * 模拟返回 observable
     */
    pipeMock(data: any, status?: number, msg?: string): Observable<{
        data: {
            code: number;
            msg: string;
            data: any;
        };
    }>;
    /**
     * 直接返回 data
     */
    pipeData(data: any): any;
    /**
     * 处理 image 流
     */
    pipeImage(): import("rxjs").OperatorFunction<any, {
        _type: string;
        data: any;
        mime: string;
    }>;
    /**
     * 处理异常
     */
    pipeError(): import("rxjs").OperatorFunction<unknown, unknown>;
}
