import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizResult } from 'src/models/quiz-result.model';

@Component({

  selector: 'app-player-stats-therapy-metrics',
  standalone: true,

  imports: [CommonModule],

  templateUrl: './player-stats-therapy-metrics.component.html',
  styleUrls: ['./player-stats-therapy-metrics.component.scss']
})
export class PlayerStatsTherapyMetricsComponent implements OnInit {
  private totalHintsUsed: number = 0;
  private averageTimeSpent: number = 0;
  private correctAnswersPercent: number = 0;
  private incorrectAnswersPercent: number = 0;

  private hintTrend: string = '';
  private timeTrend: string = '';
  private correctTrend: string = '';
  private incorrectTrend: string = '';
  
  private hintTrendPositive: boolean = false;
  private timeTrendPositive: boolean = false;
  private correctTrendPositive: boolean = false;
  private incorrectTrendPositive: boolean = false;

  @Input()
  quizResults!: QuizResult[]

  constructor(private computeStatisticService: ComputeStatisticService) { }

  ngOnInit() {
    this.totalHintsUsed = this.computeStatisticService.getAverageTotalHintsUsed(this.quizResults)
    this.averageTimeSpent = this.computeStatisticService.getAverageTotalTimeSpent(this.quizResults)
    this.correctAnswersPercent = this.computeStatisticService.getPercentageOfCorrectAnswer(this.quizResults);
    this.incorrectAnswersPercent = this.computeStatisticService.getPercentageOfIncorrectAnswer(this.quizResults);
    console.log("hints ", this.totalHintsUsed)
    console.log("time: ", this.averageTimeSpent)
    console.log("correct_answer: ", this.correctAnswersPercent)
    console.log("incorrect answers: ", this.incorrectAnswersPercent)
    this.calculateTrends();
  }

  public getTotalHints() { return this.totalHintsUsed }
  public getAverageTimeSpent() { return this.averageTimeSpent }
  public getCorrectAnswerPercent() { return this.correctAnswersPercent }
  public getIncorrectAnswerPercent() { return this.incorrectAnswersPercent }




  private calculateTrends() {

    const { currentMonthResults, previousMonthResults } = this.getMonthlyResults();

    /// je supose que si  c'est sa premier mois donc les donnee sont des 0
    const currentHints = currentMonthResults.length > 0 ?
      this.computeStatisticService.getAverageTotalHintsUsed(currentMonthResults) : 0;
    const currentTime = currentMonthResults.length > 0 ?
      this.computeStatisticService.getAverageTotalTimeSpent(currentMonthResults) : 0;
    const currentCorrect = currentMonthResults.length > 0 ?
      this.computeStatisticService.getPercentageOfCorrectAnswer(currentMonthResults) : 0;
    const currentIncorrect = currentMonthResults.length > 0 ?
      this.computeStatisticService.getPercentageOfIncorrectAnswer(currentMonthResults) : 0;

    /// Calculer les valeurs précédentes ou 0 si ya pas de donnees mois precedent
    const previousHints = previousMonthResults.length > 0 
      ? this.computeStatisticService.getAverageTotalHintsUsed(previousMonthResults) 
      : 0;
    const previousTime = previousMonthResults.length > 0 
      ? this.computeStatisticService.getAverageTotalTimeSpent(previousMonthResults) 
      : 0;
    const previousCorrect = previousMonthResults.length > 0 
      ? this.computeStatisticService.getPercentageOfCorrectAnswer(previousMonthResults) 
      : 0;
    const previousIncorrect = previousMonthResults.length > 0 
      ? this.computeStatisticService.getPercentageOfIncorrectAnswer(previousMonthResults) 
      : 0;


      const hintDiff = currentHints - previousHints;
    const timeDiff = currentTime - previousTime;
    const correctDiff = currentCorrect - previousCorrect;
    const incorrectDiff = currentIncorrect - previousIncorrect;

    //// le text du tendance 
    const hintSign = hintDiff >= 0 ? '+' : '-';
    const timeSign = timeDiff >= 0 ? '+' : '-';
    const correctSign = correctDiff >= 0 ? '+' : '-';
    const incorrectSign = incorrectDiff >= 0 ? '+' : '-';

    this.hintTrend = `Tendance: ${hintSign}${hintDiff.toFixed(1)} par rapport au mois dernier`;
    this.timeTrend = `Tendance: ${timeSign}${timeDiff.toFixed(1)}s par rapport au mois dernier`;
    this.correctTrend = `Tendance: ${correctSign}${correctDiff.toFixed(1)}% par rapport au mois dernier`;
    this.incorrectTrend = `Tendance: ${incorrectSign}${incorrectDiff.toFixed(1)}% par rapport au mois dernier`;


    
    this.hintTrendPositive = hintDiff <= 0; 
    this.timeTrendPositive = timeDiff <= 0; 
    this.correctTrendPositive = correctDiff >= 0; 
    this.incorrectTrendPositive = incorrectDiff <= 0; 
  }

  private getMonthlyResults() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthResults = this.quizResults.filter(result => {
      const date = new Date(result.dateDebut);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const previousMonthResults = this.quizResults.filter(result => {
      const date = new Date(result.dateDebut);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });

    return { currentMonthResults, previousMonthResults };
  }


  public getHintTrend() { return this.hintTrend; }
  public getTimeTrend() { return this.timeTrend; }
  public getCorrectTrend() { return this.correctTrend; }
  public getIncorrectTrend() { return this.incorrectTrend; }

  public isHintTrendPositive() { return this.hintTrendPositive; }
  public isTimeTrendPositive() { return this.timeTrendPositive; }
  public isCorrectTrendPositive() { return this.correctTrendPositive; }
  public isIncorrectTrendPositive() { return this.incorrectTrendPositive; }
}