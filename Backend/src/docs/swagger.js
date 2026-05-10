let swaggerUi = null;
let swaggerJsDoc = null;

try {
  swaggerUi = require("swagger-ui-express");
  swaggerJsDoc = require("swagger-jsdoc");
} catch (err) {
  swaggerUi = null;
  swaggerJsDoc = null;
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Indian Music Platform API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc ? swaggerJsDoc(options) : options.definition;

module.exports = {
  swaggerUi,
  specs,
};
