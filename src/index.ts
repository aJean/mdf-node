import * as rxjs from 'rxjs';
import * as core from '@nestjs/core';
import * as express from '@nestjs/platform-express';
import { IApi } from '@mdfjs/types';
// require('update-notifier');

/**
 * @file node 插件集
 */

export default function (api: IApi) {
  const presets = [
    require.resolve('@mdfjs/react'),
    require.resolve('./dev'),
    require.resolve('./build'),
  ];

  return { presets };
}

export { rxjs, core, express };
export * from '@nestjs/common';
