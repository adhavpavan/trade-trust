const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');




const invoiceSchema = mongoose.Schema({
    title: { type: String, required: false },
    address_line1: { type: String, required: false },
    address_line2: { type: String, required: false },
    address_line3: { type: String, required: false },
    invoice: { type: String, required: false },
    invoiceDate: { type: String, required: false },
    dueDate: { type: String, required: false },
    source: { type: String, required: false },
    description: { type: String, required: false },
    quantity: { type: String, required: false },
    unitTaxesPrice: { type: String, required: false },
    amount: { type: String, required: false },
    untaxedAmount: { type: String, required: false },
    tva16: { type: String, required: false },
    total: { type: String, required: false },
    paidOn: { date: { type: String, required: false },
     amount: { type: String, required: false } },
    amountDue: { type: String, required: false },
    sn_sln: { type: String, required: false },
    metaData: { type: Object, required: false },
    lotId: { type: String, required: false },
});


// add plugin that converts mongoose to json
invoiceSchema.plugin(toJSON);
invoiceSchema.plugin(paginate);
invoiceSchema.plugin(mongoosePaginate);
const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
