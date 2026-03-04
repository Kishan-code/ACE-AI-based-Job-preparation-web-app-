const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode || 500;
    error.message = message || "Internal server error";
    return error;
}

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = {
    errorHandler,
    errorMiddleware,
}