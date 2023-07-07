/* eslint-disable no-undef */
const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
});

module.exports = { AlbumPayloadSchema };
