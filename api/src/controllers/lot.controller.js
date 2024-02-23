const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, lotService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');

const createLot = catchAsync(async (req, res) => {
  const org = await lotService.createLot(req.body);
  res.status(httpStatus.CREATED).send(org);
});

const getLots = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  let filter = {
    parentId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit };
  console.log('---optipns is---', options);

  const result = await lotService.queryLots(
    filter,
  );
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Lots fetched successfully', result));
});

const getLot = catchAsync(async (req, res) => {
  const user = await lotService.getLotById(req.params.orgId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lot not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Lot fetched successfully', user));
});


module.exports = {
  createLot,
  getLots,
  getLot,
};
