const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')
const Answer = require('./answer.model.js');

module.exports = new BaseModel('Question', {
  id: Joi.number().required(),
  question: Joi.string().required(),
  answers:Joi.array().items(Answer.schema).required(),
  hints: Joi.array().items(Joi.string()).required(),
  audioPath: Joi.string().allow('').required(),
})

