import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY_SESSION_HISTORY } from 'src/mocks/session-history.mock';;
import { SessionHistory } from 'src/models/session-history.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizListService } from 'src/services/quiz-list.service';
import { QuestionResult } from 'src/models/question-result.model';
import { QuizResult } from 'src/models/quiz-result.model';

@Component({
  selector: 'app-session-result-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-result-info.component.html',
  styleUrl: './session-result-info.component.scss'
})
export class SessionResultInfoComponent {

  @Input() dateDebut:string = "None";
  @Input() quizTitle:string ="None";
  @Input() numberOfPlayers:number = -1;
  @Input() averageScore:number = -1;
  @Input() numberOfQuestions:number = -1;
  @Input() quizResults:QuizResult[] = []; 
  
  constructor(private computeStatisticService:ComputeStatisticService, private quizListService:QuizListService) {}

  public getDate() { return this.dateDebut; }

  public getQuizTitle(){ return this.quizTitle; }

  public getNumberOfPlayers(){ return this.numberOfPlayers; }


  public getScoreClass(): string {
    let percent: number = this.getPercentages();
    if (percent >= 70) return 'grande-score';
    else if (percent >= 50) return 'moyenne-score';
    return 'petite-score';
  }

  protected getPercentages():number { return this.computeStatisticService.getPercentages(this.averageScore, this.numberOfQuestions) }

  getAverageTimePerQuestions(){ return this.computeStatisticService.getAverageTimeSpent(this.getQuestionResults()); }

  getTotalHintsUsed(){ return this.computeStatisticService.getAverageHintUsed(this.getQuestionResults()) }

  public getScore(){ return this.averageScore; }

  public getTotalQuestions(){ return this.numberOfQuestions; }

  public getQuestionResults(){
    let questionResults:QuestionResult[] = [];
    this.quizResults.forEach((quizResults) => questionResults = [...questionResults, ...quizResults.questionResults])
    return questionResults;
  }
}
