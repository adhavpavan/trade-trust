const PDFParser = require('pdf-parse');
const catchAsync = require('../utils/catchAsync');


const parsePDF = catchAsync(async (req, res) => {
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

    res.json(result);
  });

  async function extractTextFromPDF(pdfPath) {
    return new Promise((resolve, reject) => {
    //   const pdfParser = new PDFParser();
    PDFParser.on('pdfParser_dataError', errData => reject(errData.parserError));
    PDFParser.on('pdfParser_dataReady', pdfData => resolve(PDFParser.getRawTextContent()));
      const pdfStream = fs.createReadStream(pdfPath);
      pdfStream.pipe(PDFParser);
    });
  }

  function extractOrderDetails(pdfText) {
    const orderIdIndex = pdfText.indexOf("Order:");
    if (orderIdIndex === -1) {
      throw new Error("Order ID not found");
    }
    const orderId = pdfText.substring(orderIdIndex + 6, orderIdIndex + 12).trim();
  
    const shippingDateIndex = pdfText.indexOf("Shipping Date:");
    if (shippingDateIndex === -1) {
      throw new Error("Shipping Date not found");
    }
    const shippingDate = pdfText.substring(
      shippingDateIndex + 15,
      shippingDateIndex + 35,
    ).trim();
  
    return {
      OrderId: orderId,
      shippingDate: shippingDate,
    };
  }
  
   function extractProductDetails(pdfText) {
    // Extract the product line
    const productLineIndex = pdfText.indexOf(
      "ProductLot/Serial NumberExpiration DateDelivered",
    );
    if (productLineIndex === -1) {
      throw new Error("Product details not found");
    }
    const productLine = pdfText.substring(productLineIndex).trim().split("\n")[1];
    console.log("Product Line:", productLine);
  
    // Split the product line into parts
    const productParts = productLine.split("EX");
    if (productParts.length !== 2) {
      throw new Error("Invalid product details format");
    }
  
    // Extracting Product, Lot/Serial Number, Expiration Date, and Delivered
    const productName = productParts[0].trim();
    const lotSerialDateDelivered = productParts[1].trim();
    const lotSerialNumber = "EX" + lotSerialDateDelivered.substring(0, 11); // Extract lot/serial number correctly
  
    // Extract expiration date (assuming it follows the "dd/mm/yyyy" pattern)
    const expirationDateMatch = lotSerialDateDelivered.match(
      /(\d{2}\/\d{2}\/\d{4})/,
    );
    const expirationDate = expirationDateMatch ? expirationDateMatch[0] : null;
  
    // Extract delivered part (including the amount and unit) correctly
    const deliveredMatch = lotSerialDateDelivered.match(
      /(\d+\.\d+)\s*([a-zA-Z]+)/,
    );
    const deliveredAmount = deliveredMatch ? deliveredMatch[1] : null;
    const deliveredUnit = deliveredMatch ? deliveredMatch[2] : null;
  
    // Format delivered information as "amount unit" and remove expiration date portion
    let delivered = null;
    if (deliveredAmount && deliveredUnit) {
      delivered = `${deliveredAmount} ${deliveredUnit}`.replace(/20\d{2}\s*/, ""); // Remove YYYY
    }
  
    return {
      productName: productName,
      lotSerialNumber: lotSerialNumber,
      expirationDate: expirationDate,
      delivered: delivered,
      actualProductLine: productLine,
    };
  }
  
   function extractAddresses(pdfText) {
    // Extract customer address
    const customerAddressIndex = pdfText.indexOf("Customer Address:");
    if (customerAddressIndex === -1) {
      throw new Error("Customer Address not found");
    }
    const customerAddressText = pdfText.substring(
      customerAddressIndex + 17,
      customerAddressIndex + 17 + 5 * 20,
    ); // Assuming each line is at most 20 characters
    const customerLines = customerAddressText.trim().split("\n");
  
    // const customerPhone = customerLines[4].replace(/\D+/g, ''); // Remove all non-digit characters
    // const formattedCustomerPhone = `+${customerPhone.substring(0)}`; // Keep "+49" and remove other characters
  
    function formattedPhone(phoneText) {
      const phone = phoneText.replace(/\D+/g, ""); // Remove all non-digit characters
      return `+${phone.substring(0)}`; // Keep "+49" and remove other characters
    }
  
    const customerAddress = {
      title: customerLines[0].trim(),
      address_line_1: customerLines[1].trim(),
      address_line_2: customerLines[2].trim(),
      address_line_3: customerLines[3].trim(),
      phone: formattedPhone(customerLines[4].trim()),
    };
  
    // Extract delivery address
    const deliveryAddressIndex = pdfText.indexOf("Delivery Address:");
    if (deliveryAddressIndex === -1) {
      throw new Error("Delivery Address not found");
    }
    const deliveryAddressText = pdfText.substring(
      deliveryAddressIndex + 17,
      deliveryAddressIndex + 17 + 5 * 20,
    ); // Assuming each line is at most 20 characters
    const deliveryLines = deliveryAddressText.trim().split("\n");
    const deliveryAddress = {
      title: deliveryLines[0].trim(),
      address_line_1: deliveryLines[1].trim(),
      address_line_2: deliveryLines[2].trim(),
      address_line_3: deliveryLines[3].trim(),
      phone: formattedPhone(deliveryLines[4].trim()),
    };
  
    return { customerAddress, deliveryAddress };
  }
  

module.exports = {
    parsePDF,
};