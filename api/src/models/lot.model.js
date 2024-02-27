const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

const lotSchema = mongoose.Schema({

    //from xls
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
    shipperReferenceId: { type: String, required: false },

    //from request body
    exporterId: { type: String, required: false },
    bankerId: { type: String, required: false },
    wholeSellerId: { type: String, required: false },
    transporterId: { type: String, required: false },

    //for internal use only
    docType: { type: String, required: false },
});


// add plugin that converts mongoose to json
lotSchema.plugin(toJSON);
lotSchema.plugin(paginate);
lotSchema.plugin(mongoosePaginate);
const Lot = mongoose.model('Lot', lotSchema);
module.exports = Lot;
