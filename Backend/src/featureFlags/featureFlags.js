module.exports = {
  AI_ENABLED:
    process.env
      .AI_ENABLED !==
    "false",

  SOCKETS_ENABLED:
    process.env
      .SOCKETS_ENABLED !==
    "false",

  ANALYTICS_ENABLED:
    process.env
      .ANALYTICS_ENABLED !==
    "false",

  RECOMMENDATIONS_ENABLED:
    process.env
      .RECOMMENDATIONS_ENABLED !==
    "false",
};