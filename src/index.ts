import { IApi } from '@mdfjs/types';
import * as Winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * @file mdf-node 插件集
 */

// require('update-notifier');
export default function (api: IApi) {
  const presets = [
    require.resolve('@mdfjs/react'),
    require.resolve('./dev'),
    require.resolve('./build'),
  ];

  return { presets };
}

export * from '@nestjs/common';
export * from '@nestjs/config';
export * from 'nest-winston';
export * as Helper from './mdf/helper';
export * as Rxjs from 'rxjs';
export * as Core from '@nestjs/core';
export * as Express from '@nestjs/platform-express';
export * as Serve from '@nestjs/serve-static';
export { Winston };
