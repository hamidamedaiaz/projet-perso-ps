const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('AnswerStatistics', {
  quizId:Joi.number().required(),
  questionId:Joi.number().required(),
  percentage:Joi.number().required(),
})
