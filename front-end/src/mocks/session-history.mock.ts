import { SessionHistory } from "src/models/session-history.model";

export const EMPTY_SESSION_HISTORY: SessionHistory = {
    sessionId: "None",
    quizId:-1,
    dateDebut: "-1",
    averageScore: 0,
    numberOfQuestions: 0,
    numberOfplayers: 0,
    quizResults: []
}