const helmet = require("helmet");
const compression = require("compression");

const cleanObject = (value) => {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const key of Object.keys(value)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      continue;
    }

    if (typeof value[key] === "string") {
      value[key] = value[key].replace(/<script\b[^>]*>(.*?)<\/script>/gi, "");
      continue;
    }

    cleanObject(value[key]);
  }
};

const sanitizeRequest = (req, res, next) => {
  cleanObject(req.body);
  cleanObject(req.query);
  cleanObject(req.params);
  next();
};

const setupSecurity = (app) => {
  app.use(helmet());
  app.use(sanitizeRequest);
  app.use(compression());
};

module.exports = setupSecurity;
