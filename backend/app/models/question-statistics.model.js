const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('QuestionStatistics', {
  questionId:Joi.number().required(),
  quizId:Joi.number().required(),
  date:Joi.Date().required(),
  timeSpent:Joi.number().required(),
  hintsUsed:Joi.number().required(),
  userAnswerIds:Joi.array().items(Joi.number()).required(),
})
