const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate-v2');



const orgSchema = mongoose.Schema({
  id: { type: Number, required: false },//TODO: revert back to required: true, once we have a way to create a root organization
  name: { type: String, required: true },
  logo: { type: String, require: false },
  type: { type: String, require: false },
  parentId: { type: Number, required: false }, //TODO: revert back to required: true, once we have a way to create a root organization
});


// add plugin that converts mongoose to json
orgSchema.plugin(toJSON);
orgSchema.plugin(paginate);
orgSchema.plugin(mongoosePaginate);
const Organization = mongoose.model('Organization', orgSchema);
module.exports = Organization;
