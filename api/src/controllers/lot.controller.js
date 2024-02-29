const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, lotService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');
const fs = require("fs");
// const csvToJson = require("convert-csv-to-json");
// const csv = require('csv-parser');
const csvTOJSON = require('../utils/csvToJSON');






const createLot = catchAsync(async (req, res) => {




  // const lot = csvToJson
  //   .indexHeader(0)//first row is header
  //   .fieldDelimiter(",") // 
  //   .supportQuotedField(true)
  //   .getJsonFromCsv(req.file.path);

  let lot = await csvTOJSON(req.file.path);
  
   const {data} = req.body;
   const metaData = JSON.parse(data);
 
   
   let finalLotData = [];
   lot.forEach(l => {
     const lotData = {
       ...l,
       ...metaData,
       exporterId: req.loggerInfo.user.orgId,
       docType: 'Lot',
     }
     finalLotData.push(lotData)
 
   })
   console.log("-----finalLotData is-----", finalLotData);
   const result = await lotService.createLot(finalLotData);
   //delete file from server
   fs.unlinkSync(req.file.path);
   res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Lot created successfully', result));




});

const getLots = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  let filter = {
    // exporterId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit };
  console.log('---optipns is---', options);

  const result = await lotService.queryLots(
    filter, options);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Lots fetched successfully', result));
});

const getLot = catchAsync(async (req, res) => {
  const lot = await lotService.getLotById(req.params.lotId);
  if (!lot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lot not found');
  }
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Lot fetched successfully', lot));
});


module.exports = {
  createLot,
  getLots,
  getLot,
};
