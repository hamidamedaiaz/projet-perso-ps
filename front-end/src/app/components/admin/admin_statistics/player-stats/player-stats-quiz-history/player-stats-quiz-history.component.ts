import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizResult } from 'src/models/quiz-result.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizListService } from 'src/services/quiz-list.service';
import { Quiz } from 'src/models/quiz.model';
import _default from "chart.js/dist/core/core.interaction";

@Component({
  selector: 'app-player-stats-quiz-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-stats-quiz-history.component.html',
  styleUrls: ['./player-stats-quiz-history.component.scss']
})

export class PlayerStatsQuizHistoryComponent {

  @Input() quizResults: QuizResult[] = [];

  @Output() viewDetailsEvent = new EventEmitter<number>();

  quizzesMap: { [id: number]: Quiz } = {};

  constructor(private computeStatisticsService: ComputeStatisticService, private quizListService: QuizListService) { }

  viewQuizDetails(quizId: number) {
    this.viewDetailsEvent.emit(quizId);
  }

  ngOnInit() {
    const quizIds = [...new Set(this.quizResults.map(qr => qr.quizId))];
    quizIds.forEach(id => {
      this.quizzesMap[id] = this.quizListService.getQuiz(id)
    });
  }

  getQuizTitle(quizId: number): string {
    return this.quizzesMap[quizId]?.title || 'Chargement...';
  }

  getQuizScore(quizResult: QuizResult): number {
    return this.computeStatisticsService.getScore(quizResult.questionResults);
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

  getQuiz(quizId: number) {
    return this.quizListService.getQuiz(quizId)
  }

  getQuizNbOfQuestions(quizResult: QuizResult): number { return quizResult.questionResults.length }

  getPercent(quizResult: QuizResult): number {
    return this.computeStatisticsService
      .getPercentages(this.getQuizScore(quizResult), this.getQuizNbOfQuestions(quizResult))
  }

  getTimeSpent(quizResult: QuizResult): number {
    return this.computeStatisticsService.getAverageTime(quizResult.questionResults)
  }

  getHintsUsed(quizResult: QuizResult): number { return this.computeStatisticsService.getTotalHintUsed(quizResult.questionResults) }

  getQuizGamemodeName(quizResult: QuizResult): string { return quizResult.gamemode.name }



  
}
