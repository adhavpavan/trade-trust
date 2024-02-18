const Joi = require("joi");
const {  objectId } = require("./custom.validation");

const createOrganization = {
  // params: Joi.object().keys({
  //   id: Joi.string().custom(objectId),
  // }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    logo: Joi.string().optional(),
    type: Joi.string().optional(),
    // id: Joi.string().custom(objectId),  //TODO: remove this once we have a way to create a root organization
    parentId: Joi.number().optional(),
  }),
};

const getOrganization = {
  query: Joi.object().keys({
    size: Joi.number().integer().max(100).required(),
    page: Joi.number().integer().required(),
  }),
};

module.exports = {
  createOrganization,
  getOrganization,
};
