const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const { USER_TYPE } = require('../utils/Constants');
const catchAsync = require('../utils/catchAsync');
const { getErrorResponse } = require('../utils/Response');


const auth = catchAsync(async(req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).send(getErrorResponse(httpStatus.UNAUTHORIZED, 'Missing token in request'));
  }
  const decodedData = jwt.verify(token, config.jwt.secret);
  req.loggerInfo = {
    user: {
      id: decodedData?.email,
      email: decodedData?.email,
      orgId: decodedData?.orgId?.toString(),
      department: decodedData?.department
    },
  };
  return next();
});

const adminAuth = catchAsync(async(req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).send(getErrorResponse(httpStatus.UNAUTHORIZED, 'Missing token in request'));
  }
  let decodedData;
  try {
    decodedData = jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message)
  }
  if(decodedData.type !== USER_TYPE.ADMIN){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this operation')
  }
 
  req.loggerInfo = {
    user: {
      id: decodedData?.email,
      email: decodedData?.email,
      orgId: parseInt(decodedData?.orgId),
      department: decodedData?.department
    },
  };
  return next();
});

module.exports = {
  auth,
  adminAuth,
};
