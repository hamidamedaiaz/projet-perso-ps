import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionResultHeaderComponent } from 'src/app/components/admin/admin_statistics/quiz-statistics/quiz-session/session-result-header/session-result-header.component';
import { SessionResultQuestionsComponent } from 'src/app/components/admin/admin_statistics/quiz-statistics/quiz-session/session-result-questions/session-result-questions.component';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { QuestionResult } from 'src/models/question-result.model';
import { Quiz } from 'src/models/quiz.model';
import { QuizListService } from 'src/services/quiz-list.service';
import { SessionResultInfoComponent } from 'src/app/components/admin/admin_statistics/quiz-statistics/quiz-session/session-result-info/session-result-info.component';
import { SessionHistory } from 'src/models/session-history.model';
import { RankingComponent } from '../../ranking/ranking.component';
import { CommonModule } from '@angular/common';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { ProfileService } from 'src/services/profile.service';
import { Rank } from 'src/models/rank.model';
import { QuizResult } from 'src/models/quiz-result.model';

@Component({
  selector: 'app-session-result-details',
  standalone: true,
  imports: [SessionResultHeaderComponent,
    SessionResultQuestionsComponent,
    SessionResultInfoComponent,
    CommonModule,
    RankingComponent],
  templateUrl: './session-result-details.component.html',
  styleUrl: './session-result-details.component.scss'
})
export class SessionResultDetailsComponent implements OnInit {

  @Input()
  sessionHistory!: SessionHistory;

  show_pop_up: boolean = false;

  quiz: Quiz = EMPTY_QUIZ;

  questionResults: QuestionResult[] = [];

  public rankList: Rank[] = [];

  protected activeTab: string = "questions";

  @Output()
  go_back: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private quizListService: QuizListService, private computeStatisticService: ComputeStatisticService, private profileService: ProfileService) {
  }

  ngOnInit(): void {
    if (this.sessionHistory.sessionId !== "None") {
      this.quiz = this.quizListService.getQuiz(this.sessionHistory.quizId)
      this.rankList = this.getRank();
    }

  }

  navigateBack() { this.go_back.emit(true); }

  public showPopUp() { }

  public closePopUp() { }

  public deleteQuizResult() { }

  public getQuiz() {
    return this.quiz;
  }

  public getQuestionResults() {
    let questionResults: QuestionResult[] = []
    this.sessionHistory.quizResults.forEach(quizResult => questionResults = [...questionResults, ...quizResult.questionResults]);
    return questionResults;
  }

  public getDateDebut() { return this.sessionHistory.dateDebut; }

  public getQuizTitle() { return this.quizListService.getQuiz(this.sessionHistory.quizId).title; }

  public getNumberOfPlayers() { return this.sessionHistory.numberOfplayers; }

  public getNumberOfQuestions() {
    return this.sessionHistory.numberOfQuestions;
  }

  public getAverageScore() { return this.sessionHistory.averageScore; }

  public getQuizResults() {
    console.log("QuizRESULTS : ", this.sessionHistory.quizResults)
    return this.sessionHistory.quizResults
  }

  public setActiveTab(newTab: string) {
    this.activeTab = newTab;
  }

  public getRank() {
    let ranking: Rank[] = []
    this.sessionHistory.quizResults.forEach((quizResult) => {
      const rank = this.computeStatisticService.createRank(quizResult);
      if(!(rank.score === -1)) ranking.push(rank);
    })
    return ranking.sort((a, b) => a.score - b.score);
  }


}
