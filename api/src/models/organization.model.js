const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String, require: false },
  parentId: { type: Number, required: true },
});

const Organization = mongoose.model('Organization', orgSchema);
module.exports = Organization;
