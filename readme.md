### mdf-node todos
- dist clean
- updater
- build
- middleware with nest
- gen server entry

#### main.ts
由框架生成，用于配置化与内部扩展
- 现在的问题是只能把  main.ts 生成到 src 源码下，对使用者透明

#### 目录规范
与 web 项目不同，node 项目根据 type 类型会采取不同的处理方式
- hybrid 混合项目，带有 client 和 server 目录，打包成 static 与 server
- node 项目，只有 src，打包成 server

#### 稳定性
- 链路监控
- 异常、内存监控
- 发布

#### 高可用
- 备份
- 负载均衡
- 多级缓存
- 集群