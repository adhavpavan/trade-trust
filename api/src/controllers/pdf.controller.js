const { extractTextFromPDF, extractAddresses, extractOrderDetails, extractProductDetails, parseHouseBillText, parseInvoiceText } = require('../services/pdf.service');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const { uploadFile, getDataHash } = require('../utils/fileUpload');
const { DeliveryProof, Invoice, Bill, Lot } = require('../models');
const { getSuccessResponse } = require('../utils/Response');
const httpStatus = require('http-status');
const { getContractObject } = require('../utils/blockchainUtils');
const { NETWORK_ARTIFACTS_DEFAULT, BLOCKCHAIN_DOC_TYPE } = require('../utils/Constants');


const parseDeliveryProofPDF = catchAsync(async (req, res) => {
  const pdfText = await extractTextFromPDF(req.file.path);
  const { customerAddress, deliveryAddress } = extractAddresses(pdfText);
  const orderDetails = extractOrderDetails(pdfText);
  const productDetails = extractProductDetails(pdfText);

  const greenCodeMatch = pdfText.match(/WH\/OUT\/\d{5}/);
  const greenCode = greenCodeMatch ? greenCodeMatch[0] : null;

  const data = {
    customerAddress,
    deliveryAddress,
    orderDetails,
    productDetails,
    greenCode,
  };

  //save pdf file to s3
  const file = {
    originalname: `DELIVERY_PROOF_${data.orderDetails.OrderId}.pdf`,
    mimetype: 'application/pdf',
    path: req.file.path,
  };
  const org = req.loggerInfo?.user.orgName ?? 'default_org';
  const fileMetadata = await uploadFile(file, org);
  console.log(fileMetadata);

  data.metaData = fileMetadata;
  data.lotId = req.body.lotId;

  //save data to database
  const result = await DeliveryProof.create(data);

  let { user } = req.loggerInfo;
  let orgName = `org${user.orgId}`;

  let gateway;
  let client
  
  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  );
  result.id =  result._id
  result.docType = BLOCKCHAIN_DOC_TYPE.POD
  await  contract.submitTransaction('CreateAsset', JSON.stringify(result));


  // delete the file
  fs.unlinkSync(req.file.path);

  // res.json({data, fileMetadata});
  // const response = {
  //   data: result,
  //   // fileMetadata,
  // };
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Delivery Proof uploaded successfully', result));

});

const parseInvoicePDF = catchAsync(async (req, res) => {

  const pdfText = await extractTextFromPDF(req.file.path);
  const data = parseInvoiceText(pdfText);


  //save pdf file to s3
  const file = {
    originalname: `INVOICE_${data.invoice}.pdf`,
    mimetype: 'application/pdf',
    path: req.file.path,
  };
  const org = req.loggerInfo?.user.orgName ?? 'default_org';
  const fileMetaData = await uploadFile(file, org);
  console.log(fileMetaData);

  data.metaData = fileMetaData;
  data.lotId = req.body.lotId;


  //save data to database
  const result = await Invoice.create(data);


  let { user } = req.loggerInfo;
  let orgName = `org${user.orgId}`;

  let gateway;
  let client

  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  );
  result.id =  result._id
  result.docType = BLOCKCHAIN_DOC_TYPE.INVOICE
  await  contract.submitTransaction('CreateAsset', JSON.stringify(result));



  //delete the file
  fs.unlinkSync(req.file.path);

  // res.json({data, fileMetadata: fileMetaData});
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Invoice uploaded successfully', result));

})

const parseHouseBillPDF = catchAsync(async (req, res) => {
  const pdfText = await extractTextFromPDF(req.file.path);
  const data = parseHouseBillText(pdfText);

  //save pdf file to s3
  const file = {
    originalname: `HOUSE_BILL_${data.shipperReference}.pdf`,
    mimetype: 'application/pdf',
    path: req.file.path,
  };
  const org = req.loggerInfo?.user.orgName ?? 'default_org';
  const fileMetadata = await uploadFile(file, org);
  console.log(fileMetadata);

  data.metaData = fileMetadata;
  data.lotId = req.body.lotId;

  //save data to database
  const result = await Bill.create(data);


  let { user } = req.loggerInfo;
  let orgName = `org${user.orgId}`;

  let gateway;
  let client

  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  );
  result.id =  result._id
  result.docType = BLOCKCHAIN_DOC_TYPE.EBL
  await  contract.submitTransaction('CreateAsset', JSON.stringify(result));
  // return response

  //delete the file
  fs.unlinkSync(req.file.path);
  // res.json({data, fileMetadata});
  res.status(httpStatus.CREATED).send(getSuccessResponse(httpStatus.CREATED, 'Bill uploaded successfully', result));
})

const verifyEBill = catchAsync(async (req, res) => {
  // get hash for the file
  const fileData = fs.readFileSync(req.file.path);
  let dataHash = getDataHash(fileData);
  console.log("-----dataHash is-----", dataHash);

  const billId = req.params.id;
  const bill = await Bill.findById(billId);

  console.log("-----bill hash is-----", bill.metaData.contentHash);

  if (!bill) {
    return res.status(httpStatus.NOT_FOUND).send(getSuccessResponse(httpStatus.NOT_FOUND, 'Bill not found', {}));
  }
  


  return res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Bill verified successfully', {
    verified: bill.metaData.contentHash === dataHash,
  }));


})

module.exports = {
  parseDeliveryProofPDF,
  parseInvoicePDF,
  parseHouseBillPDF,
  verifyEBill,
};