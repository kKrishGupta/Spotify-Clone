const logger = require('../config/logger');
const {v4: uuidv4} = require('uuid');

const requestLogger = (req,res,next) => {
  req.requestId = uuidv4();
  logger.info({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
} 
 
module.exports = requestLogger;