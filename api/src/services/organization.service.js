const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { registerUser } = require('../utils/blockchainUtils');
const Organization = require('../models/organization.model');

/**
 * Create an organization
 * @param {Object} orgBody
 * @returns {Promise<User>}
 */
const createOrganization = async (orgBody) => {
  // if (await Organization.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Organization.create(orgBody);
};

/**
 * Query for organizations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrganizations = async (filter, options) => {
  return Organization.paginate(filter, options);
};

/**
 * Get organization by id
 * @param {ObjectId} id
 * @returns {Promise<Organization>}
 */
const getOrganizationById = async (id) => {
  return Organization.findById(id);
};

const getOrganizationsByName = async (name) => {
  // list of organizations by name contains the name
  return Organization.find({ name: { $regex: name, $options: 'i' } });
};


module.exports = {
  createOrganization,
  queryOrganizations,
  getOrganizationById,
  getOrganizationsByName,
};
