const { Router } = require('express')
const QuizzesRouter = require('./quizzes')
const ProfileRouter = require('./profiles')
const GamemodeRouter = require('./gamemodes')
const quizResultRouter = require('./quiz-results')

const router = new Router()

router.get('/status', (req, res) => res.status(200).json('ok'))

router.use('/quizzes', QuizzesRouter)

router.use('/profiles', ProfileRouter)

router.use('/gamemodes', GamemodeRouter)

router.use('/quiz-results/', quizResultRouter)

module.exports = router
