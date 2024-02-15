const { v4: uuidv4 } = require('uuid');

/**
 * Create an object composed of the picked object properties
 * @returns {String}
 */
const getUUID = () => {
  return uuidv4();
};

module.exports = {
  getUUID,
};
