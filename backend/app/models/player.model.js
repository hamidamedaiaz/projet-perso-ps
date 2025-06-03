const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')
const PlayerQuestionResult = require('./player-question-result.model.js')

module.exports = new BaseModel('MultiplayerQuizSession:', {
    profileId:Joi.number().required(),
    playerQuestionResults:Joi.array().items(PlayerQuestionResult.schema).required(),
})