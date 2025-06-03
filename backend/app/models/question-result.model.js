  const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')
const Answer = require('./answer.model.js');

module.exports = new BaseModel('Question', {
  quizId: Joi.number().required(),
  questionId: Joi.number().required(),
  answerIds: Joi.array().items(Joi.number()).required(),
  timeSpent: Joi.number().required(),
  numberOfHintsUsed: Joi.number().required()
})