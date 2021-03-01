"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ignoreConfig = void 0;

/**
 * @file plugin configs
 */
const ignoreConfig = {
  checkResource: function checkResource(resource) {
    const lazyImports = ['@nestjs/microservices', '@nestjs/microservices/microservices-module', '@nestjs/websockets/socket-module', 'cache-manager', 'class-transformer', 'class-validator', 'fastify-static'];
    if (!lazyImports.includes(resource)) return false;

    try {
      require.resolve(resource);
    } catch (err) {
      return true;
    }

    return false;
  }
};
exports.ignoreConfig = ignoreConfig;