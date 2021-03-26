import winston from 'winston';

/**
 * @file 日志格式化
 */

export function genHttpFormat(): winston.Logform.Format {
  return winston.format.printf((debug) => {
    const { timestamp, level, message, ...args } = debug;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}] - ${message}`;
  });
}

export const TIMESTAMP_OPTS = { format: 'YYYY-MM-DD HH:mm:ss' };
