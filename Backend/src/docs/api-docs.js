const {
  swaggerUi,
  specs,
} = require("./swagger");

const setupSwagger = (app) => {
  if (!swaggerUi) {
    app.get("/api/docs", (req, res) =>
      res.status(503).json({
        success: false,
        message: "Swagger dependencies are not installed",
      })
    );
    return;
  }

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );
};

module.exports = setupSwagger;
