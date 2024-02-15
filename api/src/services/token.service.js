const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Organization = require('../models/organization.model');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userData, expires, type, secret = config.jwt.secret) => {
  const payload = {
    ...userData,
    iat: moment().unix(),
    exp: expires.unix(),
    tokenType: type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  let org = await Organization.findOne({ id: user.orgId });

  let userData = {
    email: user.email,
    type: user.type,
    orgId: user.orgId,
    name: user.name,
    id: user.id,
    department: user.department,
    orgName: org.name,
  };

  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(userData, accessTokenExpires, tokenTypes.ACCESS);


  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};





module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
