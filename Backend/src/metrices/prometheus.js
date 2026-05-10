let register = null;

try {
  const client = require("prom-client");
  client.collectDefaultMetrics();
  register = client.register;
} catch (err) {
  register = {
    metrics: async () => "",
    contentType: "text/plain",
  };
}

module.exports = {
  register,
};
