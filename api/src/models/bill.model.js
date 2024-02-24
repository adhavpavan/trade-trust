const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

const addressSchema = new mongoose.Schema({
    address1: String,
    address2: String,
    address3: String
  });
  
  const consignmentTotalSchema = new mongoose.Schema({
    netWeight_kg: Number,
    grossWeight_kg: Number
  });
  
  const billSchema = new mongoose.Schema({
    shipper: {
      name: String,
      address: addressSchema
    },
    consignee: {
      name: String,
      address: addressSchema
    },
    shipperReference: String,
    carrierReference: String,
    billOfLandingNumber: String,
    carrierName: String,
    placeOfReceipt: String,
    portOfLoading: String,
    portOfDischarge: String,
    placeOfDelivery: String,
    finalDestination: String,
    orderId: String,
    productName: String,
    lotNumber: String,
    netWeight_kg: Number,
    grossWeight_kg: Number,
    consignmentTotal: consignmentTotalSchema,
    numberOfOriginalBillsOfLanding: Number,
    signatoryCompany: String,
    AuthorizedSignatory: String
  });
  
  
  
  // add plugin that converts mongoose to json
  billSchema.plugin(toJSON);
  billSchema.plugin(paginate);
  billSchema.plugin(mongoosePaginate);

  const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
