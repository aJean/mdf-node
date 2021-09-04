import { Observable } from 'rxjs';
import { MongoClient } from 'mongodb';
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
export declare type Mock_Rpc = {
    _type?: string;
    data?: any;
    code?: number;
    msg?: string;
};
export declare abstract class AppService {
    private readonly shared;
    type: string;
    constructor(type: string);
    /**
     * 获取环境变量
     */
    getEnv(key: string): any;
    /**
     * 连接 mongodb
     */
    getMongo(): Promise<MongoClient>;
    /**
     * 生产 rpc 请求 host，可用于调试
     */
    genRpcHost(path: string): string;
    /**
     * 发送 rpc 请求, 熔断、限流都放到这里处理
     */
    rpc(opts: Opts_Rpc): Observable<any>;
    /**
     * 发送普通 http 请求
     */
    send(opts: Http_Rpc): Observable<any>;
    /**
     * @observer 模拟返回 observable
     */
    pipeMock(opts?: Mock_Rpc): Observable<{
        _type: string;
        data: {
            code: number;
            msg: string;
            data: any;
        };
    }>;
    /**
     * @observer 处理 image 流
     */
    pipeImage(): import("rxjs").OperatorFunction<any, {
        _type: string;
        data: any;
        mime: string;
    }>;
    /**
     * @promise 渲染模板数据
     */
    pipeHbs(data: any): any;
    /**
     * @promise promethus 接口
     */
    pipeProm(data: any): {
        _type: string;
        data: any;
    };
    /**
     * 处理异常
     */
    pipeError(_type?: string): import("rxjs").OperatorFunction<unknown, unknown>;
}
