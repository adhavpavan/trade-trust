const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, organizationService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');

const createOrganization = catchAsync(async (req, res) => {
  const org = await organizationService.createOrganization(req.body);
  res.status(httpStatus.CREATED).send(org);
});

const getOrganizations = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  let filter = {
    parentId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit };
  console.log('---optipns is---', options);

  const result = await organizationService.queryOrganizations(
    filter, options
     );
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Organizations fetched successfully', result));
});

const getOrganization = catchAsync(async (req, res) => {
  const user = await organizationService.getOrganizationById(req.params.orgId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Organization fetched successfully', user));
});


module.exports = {
 createOrganization,
  getOrganizations,
  getOrganization,
};
