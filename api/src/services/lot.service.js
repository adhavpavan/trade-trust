const httpStatus = require('http-status');
const { User, Invoice, Bill } = require('../models');
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
  // return Lot.findById(id)
  //   .populate('bills')
  //   .populate('invoices')
  //   .exec()
  console.log(id)
  const lot = await Lot.findById(id)
  console.log("lot", lot)

  // if(!lot) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'Lot not found')
  // }
  
  const invoices = await Invoice.find({lotId: id})
  const bills = await Bill.find({lotId: id})
  // const bills = await lot.populate('bills').execPopulate()
const result = {
  ...lot.toJSON(),
  invoices,
  bills
}
  return result;


};



module.exports = {
  createLot,
  queryLots,
  getLotById,
};
