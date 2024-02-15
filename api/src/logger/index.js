const logger = require('./logger.js');

module.exports = function (callingModule) {
  return logger(callingModule);
};
