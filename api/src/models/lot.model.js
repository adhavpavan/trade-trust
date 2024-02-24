const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

const lotSchema = mongoose.Schema({

    vendor: { type: String, required: false },
    deadlineDate: { type: Date, required: false },
    orderingDate: { type: Date, required: false },
    agreementType: { type: String, required: false },
    product: { type: String, required: false },
    qty: { type: Number, required: false },
    price: { type: String, required: false },
    confirmQty: { type: Number, required: false },
    tax: { type: Number, required: false },
    unitOfMeasure: { type: String, required: false },
    shipperReference: { type: String, required: false },
});


// add plugin that converts mongoose to json
lotSchema.plugin(toJSON);
lotSchema.plugin(paginate);
lotSchema.plugin(mongoosePaginate);
const Lot = mongoose.model('Lot', lotSchema);
module.exports = Lot;
