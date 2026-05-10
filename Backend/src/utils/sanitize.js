const sanitizeInput = (
  req,
  res,
  next
) => {
  const clean = (obj) => {
    if (!obj) return;

    for (const key in obj) {
      if (
        typeof obj[key] === "string"
      ) {
        obj[key] = obj[key]
          .replace(/<script>/gi, "")
          .trim();
      }
    }
  };

  clean(req.body);
  clean(req.query);
  clean(req.params);

  next();
};

module.exports = sanitizeInput;