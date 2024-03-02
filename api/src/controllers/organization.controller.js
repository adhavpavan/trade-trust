const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, organizationService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');
const { Organization } = require('../models');

const createOrganization = catchAsync(async (req, res) => {
  const org = await organizationService.createOrganization(req.body);
  // res.status(httpStatus.CREATED).send(org);
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Organization created successfully', org));
});

const getOrganizations = catchAsync(async (req, res) => {
  const { page, size, typeWise } = req.query;
  console.log('-----page is----', page);
  console.log('-----size is----', size);
  console.log('-----typeWise is----', typeWise);
  const { limit, offset } = getPagination(page, size);

  let filter = {
    // parentId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit };
  console.log('---optipns is---', options);

  let result = await organizationService.queryOrganizations(
    filter, options
  );

  // {
  //   "docs": [
  //       {
  //           "id": "65df114025e79a53c1c1b84f",
  //           "name": "Wholeseller",
  //           "type": "Wholeseller"  
  //           "parentId": 1
  //       }
  //   ],
  // }

  if (typeWise) {
    console.log('type wise filter applied');
    // make result grouped  by type
    result = await Organization.aggregate([
      {
        $group: {
          _id: "$type", // Field to group by
          organizations: { $push: { _id: "$_id", name: "$name" } }, // Push only required fields into the array
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          type: "$_id", // Rename _id to type
          organizations: 1 // Include organizations array
        }
      }
    ]).exec();

  }

  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Organizations fetched successfully', result));
});

const getOrganization = catchAsync(async (req, res) => {
  const user = await organizationService.getOrganizationById(req.params.orgId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Organization fetched successfully', user));
});

const getOrganizationsByName = catchAsync(async (req, res) => {
  const user = await organizationService.getOrganizationsByName(req.query.name);
  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Organization fetched successfully', user));
});

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  getOrganizationsByName,
};
