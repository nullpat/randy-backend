import winston from "winston";
import winstonErrsole from "winston-errsole";

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winstonErrsole(),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
      forceConsole: true,
    }),
  ],
});

export default logger;
