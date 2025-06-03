import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from 'src/services/profile.service';
import { QuizResultService } from 'src/services/quiz-result.service';
import { Profile } from 'src/models/profile.model';
import { PlayerStatsHeaderComponent } from 'src/app/components/admin/admin_statistics/player-stats/player-stats-header/player-stats-header.component';
import { PlayerStatsOverviewComponent } from 'src/app/components/admin/admin_statistics/player-stats/player-stats-overview/player-stats-overview.component';
import { PlayerStatsTherapyMetricsComponent } from 'src/app/components/admin/admin_statistics/player-stats/player-stats-therapy-metrics/player-stats-therapy-metrics.component';
import { PlayerStatsProgressionComponent } from 'src/app/components/admin/admin_statistics/player-stats/player-stats-progression/player-stats-progression.component';
import { PlayerStatsQuizHistoryComponent } from 'src/app/components/admin/admin_statistics/player-stats/player-stats-quiz-history/player-stats-quiz-history.component';
import { QuizResultDetailsComponent } from '../quiz-result-details/quiz-result-details.component';
import { GUEST_PROFILE } from 'src/mocks/profile-list.mock';
import { StatsService } from 'src/services/stats.service';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizResult } from 'src/models/quiz-result.model';

@Component({
  selector: 'app-player-stats-details',
  standalone: true,
  imports: [
    CommonModule,
    PlayerStatsHeaderComponent,
    PlayerStatsOverviewComponent,
    PlayerStatsTherapyMetricsComponent,
    QuizResultDetailsComponent,
    PlayerStatsProgressionComponent,
    PlayerStatsQuizHistoryComponent
  ],

  templateUrl: './player-stats-details.component.html',
  styleUrl: './player-stats-details.component.scss'
})

export class PlayerStatsDetailsComponent {
  profile: Profile = GUEST_PROFILE;

  totalGames: number = 0;
  bestScore: number = 0;
  averageScore: number = 0;
  averageTimePerQuestion: number = 0;
  totalHintsUsed: number = 0;
  avgTimeBetweenAnswers: number = 0;
  totalCorrectAnswers: number = 0;
  totalIncorrectAnswers: number = 0;
  correctAnswersPercent: number = 0;
  incorrectAnswersPercent: number = 0;

  public isQuizSelected: boolean = false;

  public monthlyPerformance: any[] = [];
  public quizResults: any[] = [];

  public activeTab: 'score' | 'hints' | 'time' | 'accuracy' = 'score';

  public selectedQuizId: number = -1;


  private profileId: number = -1;

  public activeYear: number = -1

  public quizResultsOfTheYear: { [month: string]: QuizResult[]; } = {};

  constructor(
    private profileService: ProfileService,
    private quizResultService: QuizResultService,
    private statsService: StatsService,
    private computeStatisticService: ComputeStatisticService,

  ) {
    this.isQuizSelected = false;
    this.activeYear = new Date(Date.now()).getFullYear();

    this.statsService.profileId$.subscribe((profileId) => {
      this.profileId = profileId
    })

    this.quizResultService.results$.subscribe(() => {
      this.quizResults = this.quizResultService.getQuizResultsByProfile(this.profileId);
      this.quizResultsOfTheYear = this.getQuizResultsOfTheYear(); // initialize par defaut les données de l'année en cours
    })

    this.profileService.getProfile(this.profileId).subscribe((profile) => this.profile = profile);

  }

  getQuizResultsOfTheYear() {
    return this.computeStatisticService.getDataPerMonth(this.quizResults, this.activeYear)
  }

  getYearsPlayed(): number[] {
    return this.computeStatisticService.getYearsPlayed(this.quizResults);
  }

  getProfile() { return this.profile; }


  setActiveTab(tab: 'score' | 'hints' | 'time' | 'accuracy') {
    this.activeTab = tab;

    const monthlyData = this.quizResultService.getPlayerMonthlyStats(this.profileId);

    switch (tab) {
      case 'score':
        this.monthlyPerformance = monthlyData.map((data: any) => ({
          month: data.month,
          score: data.score
        }));
        break;
      case 'hints':
        this.monthlyPerformance = monthlyData.map((data: any) => ({
          month: data.month,
          score: data.hintUsage
        }));
        break;
      case 'time':
        this.monthlyPerformance = monthlyData.map((data: any) => ({
          month: data.month,
          score: data.responseTime
        }));
        break;
      case 'accuracy':
        this.monthlyPerformance = monthlyData.map((data: any) => ({
          month: data.month,
          score: data.accuracy
        }));
        break;
    }
  }

  setYearData(year: number) {
    this.activeYear = year;
    this.quizResultsOfTheYear = this.computeStatisticService.getDataPerMonth(this.quizResults, this.activeYear);
  }



  viewQuizDetails(quizResultId: number) {
    this.isQuizSelected = true;
    this.selectedQuizId = quizResultId
    this.statsService.selectQuizResult(quizResultId);
  }

  hideResultDetails() { this.isQuizSelected = false }


  navigateBack() {
    this.isQuizSelected = false;
    this.selectedQuizId = -1
  }

  getScoreColor(score: number): string {
    if (score >= 70) return 'correct';
    if (score >= 50) return 'warning';
    return 'incorrect';
  }

  getQuizResults() { return this.quizResults; }
}
