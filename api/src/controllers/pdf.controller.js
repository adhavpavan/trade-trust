const { extractTextFromPDF, extractAddresses, extractOrderDetails, extractProductDetails, parseHouseBillText, parseInvoiceText } = require('../services/pdf.service');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');


const parseDeliveryProofPDF = catchAsync(async (req, res) => {
  const pdfText = await extractTextFromPDF(req.file.path);
  const { customerAddress, deliveryAddress } = extractAddresses(pdfText);
  const orderDetails = extractOrderDetails(pdfText);
  const productDetails = extractProductDetails(pdfText);

  const greenCodeMatch = pdfText.match(/WH\/OUT\/\d{5}/);
  const greenCode = greenCodeMatch ? greenCodeMatch[0] : null;

  const result = {
    customerAddress,
    deliveryAddress,
    orderDetails,
    productDetails,
    greenCode,
  };


  // delete the file
  fs.unlinkSync(req.file.path);

  res.json(result);
});

const parseInvoicePDF = catchAsync(async (req, res) => {

  const pdfText = await extractTextFromPDF(req.file.path);
  const data = parseInvoiceText(pdfText);

  //delete the file
  fs.unlinkSync(req.file.path);

  res.json(data);

})

const parseHouseBillPDF = catchAsync(async (req, res) => {
  const pdfText = await extractTextFromPDF(req.file.path);
  const data = parseHouseBillText(pdfText);

  //delete the file
  fs.unlinkSync(req.file.path);
  res.json(data);
})



module.exports = {
  parseDeliveryProofPDF,
  parseInvoicePDF,
  parseHouseBillPDF,
};