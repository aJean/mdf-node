import { IApi } from '@mdfjs/types';
import * as Winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * @file mdf-node 插件集
 */

export default function (api: IApi) {
  const presets = [
    // require.resolve('@mdfjs/react'), whill remove client render from mdf-node
    require.resolve('./dev'),
    require.resolve('./build'),
  ];

  return { presets };
}

export { Winston };
export * from '@nestjs/common';
export * from '@nestjs/config';
export * from 'nest-winston';
export * as Rxjs from 'rxjs';
export * as Core from '@nestjs/core';
export * as Express from '@nestjs/platform-express';
export * from './shared';
