import { Answer } from "./answer.model";

export interface QuestionResult {
  id:number
  quizId: number;
  questionId: number;
  answerIds: number[];
  timeSpent: number;
  numberOfHintsUsed: number;
}