import { QuestionResult } from './question-result.model';
import { Gamemode } from './gamemode.model';

export interface QuizResult {
  id: number;
  sessionId:number;
  quizId: number;
  profileId:number
  dateDebut: number;
  dateFin: number;
  questionResults: QuestionResult[];
  gamemode:Gamemode;
}