const Answer = require('./answer.model')
const Configuration = require('./configuration.model')
const answerStatistics = require('./answer-statistics.model')
const gamemode = require('./gamemode.model')
const multiplayerQuizSession = require('./multiplayer-quiz-session.model')
const playerQuestionResult = require('./player-question-result.model')
const player = require('./player.model')
const profile = require('./profile.model')
const questionStatistics = require('./question-statistics.model')
const question = require('./question.model')
const quiz = require('./quiz.model')
const userQuizStatistics = require('./user-quiz-statistics.model')
const questionModel = require('./question.model')
const quizResultModel = require('./quiz-result.model')
const questionResultModel = require('./question-result.model')

module.exports = {
  answerStatisticsModel: answerStatistics,
  Answer,
  Configuration,
  gamemode,
  multiplayerQuizSession,
  playerQuestionResult,
  player,
  profile,
  questionStatistics,
  question,
  quiz,
  userQuizStatistics,
  questionModel,
  quizResultModel,
  questionResultModel
}
