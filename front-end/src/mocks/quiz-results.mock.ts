import { QuizResult } from "src/models/quiz-result.model"
import { GAMEMODE_SOLO } from "./gamemode-list.mock"

export const QUIZ_RESULT_EMPTY :QuizResult = {
    id: -1,
    sessionId:"None",
    quizId: -1,
    profileId: 1,
    dateDebut: Date.now(),
    dateFin: Date.now(),
    questionResults: [],
    gamemode:GAMEMODE_SOLO,
    players:[]
}