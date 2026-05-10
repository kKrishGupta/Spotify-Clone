exports.success = (
  res,
  data = {},
  message = "Success",
  code = 200,
  meta = {}
) => {
  return res.status(code).json({
    success: true,
    message,
    data,

    meta: {
      timestamp:
        new Date().toISOString(),
      ...meta,
    },
  });
};

exports.error = (
  res,
  message = "Internal Server Error",
  code = 500,
  errors = [],
  meta = {}
) => {
  return res.status(code).json({
    success: false,
    message,
    errors,

    meta: {
      timestamp:
        new Date().toISOString(),
      ...meta,
    },
  });
};