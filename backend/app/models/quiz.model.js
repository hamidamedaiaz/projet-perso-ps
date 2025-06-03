const Joi = require('joi')
const Question = require('./question.model')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Quiz', {
  id: Joi.number().required(),
  title: Joi.string().required(),
  questions: Joi.array().items(Question.schema).required(),
})