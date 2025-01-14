import { logger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  logger.error(err.stack);
  res.status(status).json({
    message:
      process.env.NODE_ENV !== "production"
        ? err.message
        : "Internal Server Error",
    stack: process.env.NODE_ENV != "production" ? err.stack : {},
  });
};

export default errorHandler;
