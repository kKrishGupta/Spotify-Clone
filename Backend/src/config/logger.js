const winston = require('winston');
const path = require('path');
const fs = require('fs');

fs.mkdirSync(path.join(process.cwd(), "logs"), {
  recursive: true,
});

const logger = winston.createLogger({
  level : process.env.LOG_LEVEL || 'info',
  format : winston.format.combine(
    winston.format.timestamp(),
   winston.format.errors({ stack: true }),
   winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { level, message, timestamp, ...meta } = info;
          const body =
            typeof message === "object"
              ? JSON.stringify(message)
              : message;
          const extra = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";

          return `${timestamp} ${level}: ${body}${extra}`;
        })
      ),
    }),

    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],
   exceptionHandlers: [
    new winston.transports.File({
      filename: path.join("logs", "exceptions.log"),
    }),
  ],
});

module.exports = logger;
