const crypto =
  require("crypto");

module.exports =
  (
    req,
    res,
    next
  ) => {

    req.traceId =
      crypto.randomUUID();

    res.setHeader(
      "x-trace-id",
      req.traceId
    );

    next();
  };