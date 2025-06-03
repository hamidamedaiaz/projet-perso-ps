const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Profile', {
    id:Joi.number().required(),
    name:Joi.string().required(),
    lastName: Joi.string().required(),
    role:Joi.string().required(),
    profilePicture:Joi.string().required(),
    SHOW_POP_UP_TIMER:  Joi.number().required(),
    SHOW_HINT_TIMER: Joi.number().required(),
    REMOVE_WRONG_ANSWER_INTERVAL:  Joi.number().required(),
    NUMBER_OF_ANSWERS_DISPLAYED: Joi.number().required(),
    NUMBER_OF_HINTS_DISPLAYED: Joi.number().required(),
})