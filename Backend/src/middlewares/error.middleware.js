const logger = require("../config/logger");

const normalizeError = (err) => {
  if (err.name === "ValidationError") {
    return {
      statusCode: 400,
      message: "Validation failed",
      errors: Object.values(err.errors || {}).map((item) => item.message),
    };
  }

  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid resource identifier",
      errors: [err.message],
    };
  }

  if (err.code === 11000) {
    return {
      statusCode: 409,
      message: "Duplicate resource",
      errors: Object.keys(err.keyValue || {}),
    };
  }

  return {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.details || [],
  };
};

const errorHandler = (err, req, res, next) => {
  const normalized = normalizeError(err);
  const isServerError = normalized.statusCode >= 500;

  logger[isServerError ? "error" : "warn"]({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode: normalized.statusCode,
    message: normalized.message,
    stack: isServerError ? err.stack : undefined,
  });

  return res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    errors: normalized.errors,
    requestId: req.requestId,
    stack:
      process.env.NODE_ENV === "development" && isServerError
        ? err.stack
        : undefined,
  });
};

module.exports = errorHandler;
