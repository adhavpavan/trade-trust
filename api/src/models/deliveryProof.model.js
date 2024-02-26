const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * {
  customerAddress: {
    title: "Focus Fresh, John",
    address_line_1: "Sector 23",
    address_line_2: "34363 Amsterdam",
    address_line_3: "Netherlands",
    phone: "+497638927465"
  },
  deliveryAddress: {
    title: "Focus Fresh, John",
    address_line_1: "Sector 23",
    address_line_2: "34363 Amsterdam",
    address_line_3: "Netherlands",
    phone: "+497638927465"
  },
  orderDetails: { OrderId: "S0008", shippingDate: "02/06/2024 14:40:36" },
  productDetails: {
    productName: "Hass Avocado (Size 28)",
    lotSerialNumber: "EX06022024001",
    expirationDate: "03/07/2024",
    delivered: "20.00 Pallet",
    actualProductLine: "Hass Avocado (Size 28)EX0602202400103/07/202420.00 Pallet"
  },
  greenCode: "WH/OUT/00068"
}
 */

const customerAddressSchema = new mongoose.Schema({
    title: String,
    address_line_1: String,
    address_line_2: String,
    address_line_3: String,
    phone: String
});

const deliveryAddressSchema = new mongoose.Schema({
    title: String,
    address_line_1: String,
    address_line_2: String,
    address_line_3: String,
    phone: String
});

const orderDetailsSchema = new mongoose.Schema({
    OrderId: String,
    shippingDate: String
});

const productDetailsSchema = new mongoose.Schema({
    productName: String,
    lotSerialNumber: String,
    expirationDate: String,
    delivered: String,
    actualProductLine: String
});

const deliveryProofSchema = new mongoose.Schema({
    customerAddress: customerAddressSchema,
    deliveryAddress: deliveryAddressSchema,
    orderDetails: orderDetailsSchema,
    productDetails: productDetailsSchema,
    greenCode: String
});


// add plugin that converts mongoose to json
deliveryProofSchema.plugin(toJSON);
deliveryProofSchema.plugin(paginate);
deliveryProofSchema.plugin(mongoosePaginate);
const DeliveryProof = mongoose.model('DeliveryProof', deliveryProofSchema);
module.exports = DeliveryProof;
