const Joi = require("joi");
const {  objectId } = require("./custom.validation");



const createLot = {
  

  body: Joi.object().keys({
    vendor: Joi.string().required(),
    deadline: Joi.date().required(),
    orderingDate: Joi.date().required(),
    agreementType: Joi.string().required(),
    product: Joi.string().required(),
    qty: Joi.number().required(),
    price: Joi.number().required(),
    confirmQty: Joi.number().required(),
    tax: Joi.number().required(),
    unitOfMeasure: Joi.string().required()
  })
};

const getLot = {
  query: Joi.object().keys({
    size: Joi.number().integer().max(100).required(),
    page: Joi.number().integer().required(),
  }),
};

module.exports = {
  createLot,
  getLot,
};
