import { QuestionResult } from "./question-result.model";

export interface SessionQuestionResult {
    sessionId:string;
    quizId:number;
    questionId:number;
    questionResults:QuestionResult[];
}