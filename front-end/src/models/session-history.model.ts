import { QuizResult } from "./quiz-result.model";
import { Quiz } from "./quiz.model";

export interface SessionHistory {
    sessionId: string;
    quizId:number;
    dateDebut: string;
    averageScore: number;
    numberOfQuestions: number;
    numberOfplayers: number;
    quizResults: QuizResult[];
}