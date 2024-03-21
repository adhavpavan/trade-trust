const httpStatus = require('http-status');
const { User, Invoice, Bill, DeliveryProof } = require('../models');
const ApiError = require('../utils/ApiError');
const { registerUser, getContractObject } = require('../utils/blockchainUtils');
const Lot = require('../models/lot.model.js');
const { NETWORK_ARTIFACTS_DEFAULT, BLOCKCHAIN_DOC_TYPE } = require('../utils/Constants');

/**
 * Create an lot
 * @param {Object} lotBody
 * @returns {Promise<User>}
 */
const createLot = async (lotBody, user) => {
  // if (await Lot.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }

  let orgName = `org${user.orgId}`;
  let response = await Lot.create(lotBody);
  console.log("-------------------------response is ---------------", response)
  let gateway;
  let client

  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  ); 
  if(response?.length){

    for(let lot of response){
      lot.id =  lot._id
      lot.docType = BLOCKCHAIN_DOC_TYPE.LOT
      
      await  contract.submitTransaction('CreateAsset', JSON.stringify(lot));
      console.log("lot  added successfully on blockchain", lot)
      
    }
  }
  return response
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
  const PODs = await DeliveryProof.find({lotId: id})
  // const bills = await lot.populate('bills').execPopulate()
const result = {
  ...lot?.toJSON(),
  invoices,
  bills,
  PODs
}
  return result;


};



module.exports = {
  createLot,
  queryLots,
  getLotById,
};
