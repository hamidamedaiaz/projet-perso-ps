import { QuizResult } from "./quiz-result.model";

export interface SessionHistory {
    sessionId: string;
    quizId: number;
    dateDebut: number;
    averageScore: number;
    numberOfQuestions: number;
    numberOfplayers: number;
    quizResults: QuizResult[];
}