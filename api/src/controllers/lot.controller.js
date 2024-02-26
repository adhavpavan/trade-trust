const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, lotService } = require('../services');
const { getPagination } = require('../utils/pagination');
const { getSuccessResponse } = require('../utils/Response');
const xlsx = require("xlsx");
const fs = require("fs");


const createLot = catchAsync(async (req, res) => {

  const workbook = xlsx.readFile(
    req.file.path,
  );
  const sheetNames = workbook.SheetNames[0];
  const testDaa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames]);

  const transformData = (testData) => {
    const lots = [];
    let currentLot = {}; // Initialize the currentLot object

    for (const data of testData) {
      // Extracting vendor
      const vendorMatch = data["Test Data"]?.match(/("1|1)\. Vendor - (.+)/);
      if (vendorMatch) {
        currentLot.vendor = vendorMatch[2];
      }

      // Extracting deadlineDate
      const deadlineDateMatch = data["Test Data"]?.match(
        /2\. Deadline date - (.+)/,
      );
      if (deadlineDateMatch) {
        currentLot.deadlineDate = deadlineDateMatch[1];
      }

      // Extracting orderingDate
      const orderingDateMatch = data["Test Data"]?.match(
        /3\. Ordering date - (.+)/,
      );
      if (orderingDateMatch) {
        currentLot.orderingDate = orderingDateMatch[1];
      }

      // Extracting agreementType
      const agreementTypeMatch = data["Test Data"]?.match(
        /4\. Agreement Type - (.+)/,
      );
      if (agreementTypeMatch) {
        currentLot.agreementType = agreementTypeMatch[1];
      }

      // Extracting product
      const productMatch = data["Test Data"]?.match(/4\. Product - (.+)/);
      if (productMatch) {
        currentLot.product = productMatch[1];
      }

      // Extracting qty
      const qtyMatch = data["Test Data"]?.match(/5\. Qty - (\d+)/);
      if (qtyMatch) {
        currentLot.qty = parseInt(qtyMatch[1], 10);
      }

      // Extracting price
      const priceMatch = data["Test Data"]?.match(/6\. Price - (.+)/);
      if (priceMatch) {
        currentLot.price = priceMatch[1];
      }

      // Extracting confirmQty
      const confirmQtyMatch = data["Test Data"]?.match(
        /10\. Confirm Qty. - (\d+)/,
      );
      if (confirmQtyMatch) {
        currentLot.confirmQty = parseInt(confirmQtyMatch[1], 10);
      }

      // Extracting enterTax
      const enterTaxMatch = data["Test Data"]?.match(/11\. Enter tax- (.+)/);
      if (enterTaxMatch) {
        currentLot.enterTax = enterTaxMatch[1];
      }

      // Extracting unitOfMeasure
      const unitOfMeasureMatch = data["Test Data"]?.match(
        /14\. Unit of measure - (.+)/,
      );
      if (unitOfMeasureMatch) {
        currentLot.unitOfMeasure = unitOfMeasureMatch[1];
      }

      // Extracting shipperReference
      const shipperReferenceMatch = data["Actual Result"]?.match(
        /P\d+/,
      );

      if (shipperReferenceMatch) {
        currentLot.shipperReference = shipperReferenceMatch[0];
      }

      // Check if all required fields are present to push the currentLot to lots array
      if (
        currentLot.vendor &&
        currentLot.deadlineDate &&
        currentLot.orderingDate &&
        currentLot.agreementType &&
        currentLot.product &&
        currentLot.qty &&
        currentLot.price &&
        currentLot.confirmQty &&
        currentLot.enterTax &&
        currentLot.unitOfMeasure &&
        currentLot.shipperReference
      ) {
        // Push the currentLot to lots array and reset it for the next Lot
        lots.push(currentLot );
        currentLot = {}; // Reset currentLot
      }
    }

    return lots;
  };

  // Example usage
  const lot = transformData(testDaa);

console.log("-----lot is-----", lot);
  const metaData = req.body

  const finalLotData = []
  lot.forEach(lot => {
    const lotData = {
      ...lot,
      ...metaData,
      docType: 'Lot',
    }
    finalLotData.push(lotData)

  })
  console.log("-----finalLotData is-----", finalLotData);
 const result =  await lotService.createLot(finalLotData);
 //delete file from server
 fs.unlinkSync(req.file.path);
  res.status(httpStatus.CREATED).send(result);
});

const getLots = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  let filter = {
    exporterId: parseInt(req.loggerInfo.user.orgId),
  };
  console.log('------orgid is---', filter);

  const options = { offset, limit };
  console.log('---optipns is---', options);

  const result = await lotService.queryLots(
     filter, options);
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
