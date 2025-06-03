const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Answer', {
  id: Joi.number().required(),
  questionId: Joi.number().required(),
  answerContent: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
})