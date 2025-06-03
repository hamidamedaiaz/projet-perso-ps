const { Router } = require('express')
const QuizResults = require('../../models/quiz-result.model')
const router = new Router()

router.get('/', (req, res) => {
  try {
    const quizResults = QuizResults.get();
    //console.log(quizResults)
    res.status(200).json(quizResults);
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
})

router.post('/', (req, res) => {
  try {
    const newResult = QuizResults.create(req.body)
    res.status(200).json(newResult);
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
})

router.delete('/:id', (req, res) => {
  try {
    const quizResultId = parseInt(req.params.id);
    console.log(`Requête de suppression du quiz-result id=${quizResultId} reçue`);

    try {
      //On vérifie si le quiz result existe pour renvoyer l'erreur adaptée
      QuizResults.getById(quizResultId);
    } catch (error) {
      return res.status(404).json({ error: `Quiz Result avec l'id ${quizResultId} non trouvé` });
    }

    QuizResults.delete(quizResultId);
    console.log(`Quiz-result avec id=${quizResultId} supprimé`);

    res.status(200).json({ success: true, message: `Quiz-result avec l'id ${quizResultId} supprimé` });
  } catch (err) {
    res.status(500).json(err)
    console.log('Erreur lors de la suppression du quiz-result:', err)
  }
})

module.exports = router
