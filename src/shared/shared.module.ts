import { HttpModule, Module, Injectable, HttpService } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Serve from '@nestjs/serve-static';
import Helper from './helper';

/**
 * @file shared 公共服务
 */

@Injectable()
export class SharedService {
  constructor(protected httpService: HttpService, protected configService: ConfigService) {}

  http() {
    return this.httpService;
  }

  config() {
    return this.configService;
  }

  getConfig(key: string) {
    return this.config().get(key);
  }
}

export type MdfModuleOptions = {
  timeout?: number;
  serve?: any;
};

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class SharedModule {
  /**
   * 必须使用动态导入，否则无法拿到正确的 env 信息
   */
  static forRoot(opts: MdfModuleOptions = {}): any {
    const { timeout = 15000, serve } = opts;
    const imports = [
      HttpModule.register({ timeout }),
      ConfigModule.forRoot({ envFilePath: Helper.genEnvFiles(), isGlobal: true }),
    ];

    if (serve) {
      imports.push(
        Serve.ServeStaticModule.forRoot({
          rootPath: serve.rootPath,
          serveRoot: serve.serveRoot,
        }),
      );
    }

    return {
      module: SharedModule,
      imports,
      providers: [SharedService],
      exports: [HttpModule, SharedService],
    };
  }
}
