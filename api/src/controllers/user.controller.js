const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const updateUserStatus = catchAsync(async (req, res) => {
  let { orgId } = req.loggerInfo.user;
  let { id } = req.params;
  let status = req.body.status;
  const user = await userService.updateUserStatus(id, status);
  res
    .status(httpStatus.OK)
    .send(getSuccessResponse(httpStatus.OK, `User status updated successfully, Status: ${user.status}`, ''));
});

const getUsers = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit, sort: { createdAt: -1 } };
  console.log('---optipns is---', options);

  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Users fetched successfully', result));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'User fetched successfully', user));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
};
