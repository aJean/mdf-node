### mdf-node
node 工程模块，主要用来处理 node 项目的生成、构建与插件集成

#### todos
- 抽象基础能力封入框架层，main.ts 使用通用方案处理
- updater 升级提示
- middleware with nest 中间件自动混入
- 标准化打包 static + server
- 容器脚本

#### main.ts
由框架生成，用于配置化与内部扩展

#### 目录规范
与 web 项目不同，node 项目根据 type 类型会采取不同的处理方式
- hybrid 混合项目，带有 client 和 server 目录，打包成 static 与 server
- node 项目，只有 src，打包成 server

#### 稳定性
支持 promethus 接口，接入阿里云日志 sdk
- 链路监控
- 异常、内存监控
- 发布

#### 高可用
- 备份
- 负载均衡
- 多级缓存
- 集群
