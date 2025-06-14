import { QuestionResult } from './question-result.model';
import { Gamemode } from './gamemode.model';
import { Profile } from './profile.model';

export interface QuizResult {
  id: number;
  sessionId:string;
  quizId: number;
  profileId:number
  dateDebut: number;
  dateFin: number;
  questionResults: QuestionResult[];
  gamemode:Gamemode;
  players:Profile[];
}