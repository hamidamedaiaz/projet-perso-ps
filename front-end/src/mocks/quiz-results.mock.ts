import { QuizResult } from "src/models/quiz-result.model"
import { QUIZ_EXAMPLE, QUIZ_EXAMPLE2 } from "./quiz.mock"
import { QUESTION_RESULT, QUESTION_RESULT2 } from "./question-result.mock"
import { GAMEMODE_SOLO } from "./gamemode-list.mock"

export const QUIZ_RESULT_EMPTY :QuizResult = {
    id: 0,
    sessionId:0,
    quizId: QUIZ_EXAMPLE.id,
    profileId: 1,
    dateDebut: Date.now(),
    dateFin: Date.now(),
    questionResults: QUESTION_RESULT,
    gamemode:GAMEMODE_SOLO
}

export const QUIZ_RESULT_EMPTY2: QuizResult = {
    id: 1,
    sessionId:1,
    quizId: QUIZ_EXAMPLE2.id,
    profileId: 2,
    dateDebut: Date.now() +1,
    dateFin: Date.now() +2,
    questionResults: QUESTION_RESULT2,
    gamemode:GAMEMODE_SOLO
}