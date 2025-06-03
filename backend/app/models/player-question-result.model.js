const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('PlayerQuestionResult:', {
    quizId:Joi.number().required(),
    questionId:Joi.number().required(),
    correctAnswersIds:Joi.array().items(Joi.number()).required(),
    SelectedWrongAnswersIds:Joi.array().items(Joi.number()).required()
})