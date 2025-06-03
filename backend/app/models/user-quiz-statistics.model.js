const Joi = require('joi')
const QuestionStatistics = require('./question-statistics.model')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('UserQuizStatistics', {
  id:Joi.number().required(),
  quizId: Joi.number().required(),
  date:Joi.Date().required(),
  timeSpent:Joi.number().required(),
  hintsUsed:Joi.number().required(),
  questionStatistics: Joi.array().items(QuestionStatistics.schema).required(),
})
