import { HttpModule, Module, Injectable, HttpService } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Serve from '@nestjs/serve-static';
import { genEnvFiles } from './utils';

/**
 * @file mdf 公共服务
 */

@Injectable()
export class MdfService {
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
    ConfigModule.forRoot({ envFilePath: genEnvFiles(), isGlobal: true }),
  ],
  providers: [MdfService],
  exports: [HttpModule, MdfService],
})
export class MdfModule {
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
      ngModule: MdfModule,
      imports,
      providers: [MdfService],
      exports: [HttpModule, MdfService],
    };
  }
}
