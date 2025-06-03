const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')
const QuestionResultModel = require('./question-result.model.js')
const GamemodeModel = require('./gamemode.model.js')

module.exports = new BaseModel('Question', {
  id: Joi.number().required(),
  sessionId: Joi.number().required(),
  quizId: Joi.number().required(),
  profileId: Joi.number().required(),
  dateDebut: Joi.number().required(),
  dateFin: Joi.number().required(),
  questionResults: Joi.array().items(QuestionResultModel.schema).required(),
  gamemode: GamemodeModel.schema.required(),
})
