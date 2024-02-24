const pdf = require('pdf-parse');

async function extractTextFromPDF(dataBuffer) {
    const data = await pdf(dataBuffer);

    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata);
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text);

    return data.text;

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

function parseInvoiceText(rawText) {
    const lines = rawText.split("\n").map((line) => line.trim());

    const invoiceData = {
        title: lines[2],
        address_line1: lines[3],
        address_line2: lines[4],
        address_line3: lines[5],
        invoice: lines[6].replace("Invoice ", ""),
        invoiceDate: lines[8],
        dueDate: lines[10],
        source: lines[12],
        description: "",
        quantity: "",
        unitTaxesPrice: "",
        amount: "",
        untaxedAmount: "",
        tva16: "",
        total: "",
        paidOn: { date: "", amount: "" },
        amountDue: "",
        sn_sln: "",
    };

    let descriptionLines = [];
    let i = 16;

    // Include lines until the "Friendly note" section
    while (lines[i] && !lines[i].startsWith("Friendly note")) {
        descriptionLines.push(lines[i]);
        i++;
    }

    // Include the "Friendly note" section
    while (lines[i] && !/^\d/.test(lines[i])) {
        descriptionLines.push(lines[i]);
        i++;
    }

    invoiceData.description = descriptionLines.join("\n");

    // Assign the correct values for quantity, unitTaxesPrice, and amount
    invoiceData.quantity = lines[i].startsWith("Pallet")
        ? lines[i]
        : lines[i] + " " + lines[i + 1];
    invoiceData.unitTaxesPrice = lines[i].startsWith("Pallet")
        ? lines[i + 1] + " " + lines[i + 2]
        : lines[i + 2] + " " + lines[i + 3] + " " + lines[i + 4];
    invoiceData.amount = lines[i].startsWith("Pallet")
        ? lines[i + 3]
        : lines[i + 5];

    // Assign values for untaxedAmount, tva16, and total
    invoiceData.untaxedAmount = lines.find((line) =>
        line.includes("Untaxed Amount")
    )?.replace("Untaxed Amount", "").trim();
    invoiceData.tva16 = lines.find((line) => line.includes("TVA 16%"))?.replace(
        "TVA 16%",
        "",
    ).trim();
    invoiceData.total = lines.find((line) => line.includes("Total"))?.replace(
        "Total",
        "",
    ).trim();

    // Extract the paidOn date and amount
    const paidOnLine = lines.find((line) =>
        /^Paid on \d{2}\/\d{2}\/\d{4}/.test(line)
    );
    const paidOnRegex = /Paid on (\d{2}\/\d{2}\/\d{4})/;
    const paidOnMatch = paidOnLine.match(paidOnRegex);
    invoiceData.paidOn.date = paidOnMatch[1];
    invoiceData.paidOn.amount = invoiceData.total;

    // Assign the amount due
    invoiceData.amountDue = lines.find((line) => line.includes("Amount Due"))?.replace("Amount Due", "").trim();

    // Extract the SN/LN from the product line
    const productQuantitySNLNLineIndex = lines.findIndex((line) =>
        line.includes("ProductQuantitySN/LN")
    );
    invoiceData.sn_sln = lines[productQuantitySNLNLineIndex + 1].substring(
        lines[productQuantitySNLNLineIndex + 1].indexOf("EX"),
    );

    return invoiceData;
}

function parseHouseBillText(rawText) {
    const lines = rawText.split("\n").map((line) => line.trim());

    return {
        shipper: {
            name: lines[14],
            address: {
                address1: lines[4],
                address2: lines[6] + " " + lines[8] + " " + lines[10],
                address3: lines[12],
            },
        },
        consignee: {
            name: lines[35],
            address: {
                address1: lines[25],
                address2: lines[27] + " " + lines[29] + " " + lines[31],
                address3: lines[33],
            },
        },
        "shipperReference": lines[18],
        "carrierReference": lines[22],
        "billOfLandingNumber": lines[20],
        "carrierName": lines[37],
        "placeOfReceipt": lines[39],
        "portOfLoading": lines[41],
        "portOfDischarge": lines[43],
        "placeOfDelivery": lines[45],
        "finalDestination": lines[47],
        "orderId": lines[49],
        "productName": lines[51],
        "lotNumber": lines[53],
        "netWeight_kg": formatFloatNumber(lines[55]),
        "grossWeight_kg": formatFloatNumber(lines[57]),
        "consignmentTotal": {
            "netWeight_kg": formatFloatNumber(splitWithRegex(lines[60])[0]),
            "grossWeight_kg": formatFloatNumber(splitWithRegex(lines[60])[1]),
        },
        "numberOfOriginalBillsOfLanding": Number(lines[63]),
        "signatoryCompany": lines[67],
        "AuthorizedSignatory": lines[69],
    };
}

function formatFloatNumber(numberStr) {
    const numberWithCommasRemoved = numberStr.replace(/,/g, '');
    return parseFloat(numberWithCommasRemoved);
}


function splitWithRegex(string) {
    return string.match(/\d+,\d{3}\.\d{2}/g);

}


module.exports = {

    // parseCustomerAddress,
    // parseDeliveryAddress,
    parseInvoiceText,
    parseHouseBillText,
    formatFloatNumber,
    splitWithRegex,
    extractAddresses,
    extractOrderDetails,
    extractProductDetails,
    extractTextFromPDF,
};