const { Router } = require('express')
const Quizzes = require('../../models/quiz.model')

const router = new Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json(Quizzes.get())
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
})

router.get('/:id', (req, res) => {
  try {
    res.status(200).json(Quizzes.getById(req.params.id));
  } catch(err){
    res.status(500).json(err);
    console.log(err);
  }
})

router.post('/', (req, res) => {
  try {
    try {
      const quiz = Quizzes.update(req.body.id, req.body)
      res.status(200).json(quiz)
    } catch (err) {
      const quiz = Quizzes.create(req.body)
      res.status(201).json(quiz)
      return
    }
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
})

router.put('/', (req, res) => {
  try {
    const quiz = Quizzes.update(req.body.id, req.body)
    res.status(200).json(quiz)
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
})

router.delete('/:id', (req, res) => {
  try {
    const quizzes = Quizzes.delete(req.params.id);
    res.status(200).json(quizzes);
  } catch(err) {
    res.status(500).json(err)
    console.log(err)
  }
})

module.exports = router
