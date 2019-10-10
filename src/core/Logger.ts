import moment from 'moment';

export enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
};

export default class Logger {
  private static logBuffer: string[] = [];

  static log(level: LogLevel, ...args: any[]) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss:SSS');

    const prefix = `[${time}][${level}]:`;
    const payload = args.reduce((prev, cur) => {
      if (typeof(cur) === 'object') {
        try { cur = JSON.stringify(cur); }
        catch {}
      }

      return prev + ` ${cur.toString()}`;
    });

    console.log(prefix, payload);
    Logger.logBuffer.push(`${prefix} ${payload}`);
  }

  public static info(...args: any[]) { Logger.log(LogLevel.INFO, ...args); }
  public static debug(...args: any[]) { Logger.log(LogLevel.DEBUG, ...args); }
  public static warn(...args: any[]) { Logger.log(LogLevel.WARN, ...args); }
  public static error(...args: any[]) { Logger.log(LogLevel.ERROR, ...args); }
};