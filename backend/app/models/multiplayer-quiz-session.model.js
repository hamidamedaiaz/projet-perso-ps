const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')
const Player = require('./player.model.js')

module.exports = new BaseModel('MultiplayerQuizSession:', {
    quizSessionId:Joi.number().required(),
    codeSession:Joi.number().required(),
    quizId:Joi.number().required(),
    players:Joi.array().items(Player.schema).required(),
    dateDebut:Joi.Date().required(),
})