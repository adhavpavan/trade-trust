const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { qsccService } = require('../services');
const { getSuccessResponse } = require('../utils/Response');

const getBlock = catchAsync(async (req, res) => {
  const { blockNumber } = req.params;
  let { user } = req.loggerInfo;
  const blockData = await qsccService.getBlockByBlockNumber(blockNumber, user);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Block data fetched successfully', blockData));
});

const getTx = catchAsync(async (req, res) => {
  const { txId } = req.params;
  let { user } = req.loggerInfo;
  const txData = await qsccService.getTxByTxId(txId, user);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Transaction data fetched successfully', txData));
});

module.exports = {
  getBlock,
  getTx,
};
