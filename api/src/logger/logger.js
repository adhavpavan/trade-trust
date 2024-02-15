const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label } = format;
require('winston-daily-rotate-file');

const getLabel = function (callingModule) {
  const parts = callingModule.filename.split('/');
  return `${parts[parts.length - 2]}/${parts.pop()}`;
};
class Logger {
  constructor(logger) {
    Logger.instance = this;
    this.logger = logger;
  }

  static getInstance(name) {
    if (!Logger.instance) {
      let filePath = './src/logger/logs/';
      const logger = createLogger({
        level: 'debug',
        format: combine(
          label({
            label: name,
          }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.errors({ stack: true }),
          format.json()
        ),

        transports: [
          new transports.Console(),
          new transports.DailyRotateFile({
            filename: `${filePath}all-%DATE%.log`,
            maxSize: '20m',
            maxFiles: '14d',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            level: 'info',
            needDrain: true,
            timestamp: true,
            json: true,
          }),
          new transports.DailyRotateFile({
            filename: `${filePath}errors-%DATE%.log`,
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            needDrain: true,
            prettyPrint: true,
            colorize: true,
            timestamp: true,
          }),
        ],
      });

      Logger.instance = new Logger(logger);
    }
    return Logger.instance;
  }
}

module.exports = function (module) {
  return {
    error(text) {
      Logger.getInstance(getLabel(module)).logger.error(text);
    },
    info(text) {
      Logger.getInstance(getLabel(module)).logger.info(text);
    },
  };
};
