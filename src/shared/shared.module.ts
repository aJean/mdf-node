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
  timeout: number;
  envs: string[];
  serve?: any;
};

@Module({
  imports: [
    HttpModule.register({ timeout: 15000 }),
    ConfigModule.forRoot({ envFilePath: Helper.genEnvFiles(), isGlobal: true }),
  ],
  providers: [SharedService],
  exports: [HttpModule, SharedService],
})
export class SharedModule {
  static forRoot(opts: MdfModuleOptions): any {
    const { timeout, serve, envs } = opts;
    const imports = [
      HttpModule.register({ timeout }),
      ConfigModule.forRoot({ envFilePath: envs, isGlobal: true }),
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
      ngModule: SharedModule,
      imports,
      providers: [SharedService],
      exports: [HttpModule, SharedService],
    };
  }
}
