const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { registerUser } = require('../utils/blockchainUtils');
const Lot = require('../models/lot.model.js');

/**
 * Create an lot
 * @param {Object} lotBody
 * @returns {Promise<User>}
 */
const createLot = async (lotBody) => {
  // if (await Lot.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Lot.create(lotBody);
};

/**
 * Query for lots
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLots = async (filter, options) => {
  return Lot.paginate(filter, options);
};

/**
 * Get lot by id
 * @param {ObjectId} id
 * @returns {Promise<Lot>}
 */
const getLotById = async (id) => {
  return Lot.findById(id);
};



module.exports = {
  createLot,
  queryLots,
  getLotById,
};
