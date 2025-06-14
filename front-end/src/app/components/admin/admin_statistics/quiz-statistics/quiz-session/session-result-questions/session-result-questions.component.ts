import { Component, Input, OnInit } from '@angular/core';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { EMPTY_SESSION_HISTORY } from 'src/mocks/session-history.mock';
import { Quiz } from 'src/models/quiz.model';
import { SessionHistory } from 'src/models/session-history.model';
import { QuizListService } from 'src/services/quiz-list.service';
import { SessionResultService } from 'src/services/session-result.service';
import { CommonModule } from '@angular/common';
import { SessionQuestionResult } from 'src/models/session-result.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuestionResult } from 'src/models/question-result.model';

@Component({
  selector: 'app-session-result-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-result-questions.component.html',
  styleUrl: './session-result-questions.component.scss'
})
export class SessionResultQuestionsComponent implements OnInit{

  @Input()
  sessionHistory: SessionHistory = EMPTY_SESSION_HISTORY

  protected quiz: Quiz = EMPTY_QUIZ;

  public sessionQuestionResults: SessionQuestionResult[] = [];

  constructor(
    private quizListService: QuizListService,
    private sessionResultService: SessionResultService,
    private computeStatisticService:ComputeStatisticService
  ) {}

  ngOnInit(): void {
    // Initialiser ici quand l'@Input est disponible
    this.quiz = this.quizListService.getQuiz(this.sessionHistory.quizId);
    this.sessionQuestionResults = this.sessionResultService.getSessionResults(this.sessionHistory);
    console.log("sessionHistory", this.sessionHistory)
  }

  public getSessionResults() {
    return this.sessionQuestionResults;
  }

  public getQuestion(questionIndex: number) {
    return this.quiz.questions[questionIndex];
  }

  public getAverageTimeSpent(questionResults:QuestionResult[]) {
    return this.computeStatisticService.getAverageTimeSpent(questionResults);
  }

  public getAverageHintsUsed(questionResults:QuestionResult[]){
    return this.computeStatisticService.getAverageHintUsed(questionResults);
  }

  public getNumberOfTimesSelected(sessionQuestionResult:SessionQuestionResult, answerId:number){
    let counter = 0;
    sessionQuestionResult.questionResults.forEach((questionResult) => {
      if(questionResult.answerIds.includes(answerId)) counter++;
    })
    return counter;
  }

}
