import winston from "winston";
import WinstonErrsole from "winston-errsole";

const logger = winston.createLogger({
  level: "debug",
  transports: [new WinstonErrsole()],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
