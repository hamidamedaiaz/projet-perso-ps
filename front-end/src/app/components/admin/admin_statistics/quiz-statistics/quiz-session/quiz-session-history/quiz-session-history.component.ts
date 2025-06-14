import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuizResult } from 'src/models/quiz-result.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizListService } from 'src/services/quiz-list.service';
import { CommonModule } from '@angular/common';
import { QuizResultService } from 'src/services/quiz-result.service';
import { SessionHistory } from 'src/models/session-history.model';
import { SessionResultService } from 'src/services/session-result.service';
@Component({
  selector: 'app-quiz-session-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-session-history.component.html',
  styleUrl: './quiz-session-history.component.scss'
})
export class QuizSessionHistoryComponent {

  @Input() sessionHistory: SessionHistory[] = [];

  @Input()
  quizId: number = -1;

  @Input()
  quizTitle: string = 'Chargement...' //Afficher cette valeur tant qu'on a pas reçu la nouvelle

  @Output() viewDetailsEvent = new EventEmitter<string>();

  constructor(private computeStatisticsService: ComputeStatisticService, 
              private quizListService: QuizListService) {}

  viewSessionDetails(sessionId: string) {
    this.viewDetailsEvent.emit(sessionId);
  }

  getQuizTitle(quizId: number): string {
    return this.quizListService.getQuiz(quizId).title;
  }

  getScoreColor(score: number): string {
    if (score >= 70) return 'correct';
    if (score >= 50) return 'warning';
    return 'incorrect';
  }

  getQuizResultDateDebut(quizresult: QuizResult): string {
    return this.computeStatisticsService.convertTimeStampToDate(quizresult.dateDebut)
  }

  getQuizId(quizResult: QuizResult): number { return quizResult.quizId }

  getQuizNbOfQuestions(quizResult: QuizResult): number { return quizResult.questionResults.length }

  getPercent(sessionHistory:SessionHistory): number {
    return this.computeStatisticsService
      .getPercentages(sessionHistory.averageScore, sessionHistory.numberOfQuestions)
  }

  getQuizGamemodeName(quizResult: QuizResult): string { return quizResult.gamemode.name }

}
