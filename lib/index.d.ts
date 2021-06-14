import * as rxjs from 'rxjs';
import * as core from '@nestjs/core';
import * as express from '@nestjs/platform-express';
import { IApi } from '@mdfjs/types';
/**
 * @file node 插件集
 */
export default function (api: IApi): {
    presets: string[];
};
export { rxjs, core, express };
export * from '@nestjs/common';
