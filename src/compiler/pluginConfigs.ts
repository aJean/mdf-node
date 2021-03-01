/**
 * @file plugin configs
 */

export const ignoreConfig = {
  checkResource: function (resource: any) {
    const lazyImports = [
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-static',
    ];

    if (!lazyImports.includes(resource)) return false;

    try {
      require.resolve(resource);
    } catch (err) {
      return true;
    }

    return false;
  },
};
