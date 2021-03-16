import winston from 'winston';

/**
 * @file 日志格式化
 */

export function genHttpFormat(): winston.Logform.Format {
  return winston.format.printf((debug) => {
    const { timestamp, level, message, ...args } = debug;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  });
}

export const TIMESTAMP_OPTS = { format: 'YYYY-MM-DD HH:mm:ss' };
