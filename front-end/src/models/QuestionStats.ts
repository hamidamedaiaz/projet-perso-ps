export interface QuestionStats {
  questionId: number;
  totalAnswers: number;
  answerCounts: Map<number, number>; 
  percentages: Map<number, number>; 
}