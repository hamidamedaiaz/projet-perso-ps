import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Quiz } from 'src/models/quiz.model';
import { CurrentPageService } from "src/services/currentPage.service";
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { StatsService } from 'src/services/stats.service';
import { QuizListService } from 'src/services/quiz-list.service';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { QuizResultService } from 'src/services/quiz-result.service';
import { QuizResult } from 'src/models/quiz-result.model';
import { QuizSessionHistoryComponent } from '../quiz-session/quiz-session-history/quiz-session-history.component';
import { SessionResultDetailsComponent } from 'src/app/components/admin/admin_statistics/quiz-statistics/quiz-session/session-result-details/session-result-details.component';
import { SessionHistory } from 'src/models/session-history.model';
import { EMPTY_SESSION_HISTORY } from 'src/mocks/session-history.mock';
import { SessionResultService } from 'src/services/session-result.service';
import { SessionQuestionResult } from 'src/models/session-result.model';

Chart.register(...registerables);

interface QuestionStat {

  text: string;
  options: string[];
  pctFirst: number[];
  pctSecond: number[];
  pctThird: number[];
  pctFourth: number[];
  avgTime: number;
  hintsUsed: number;

}

@Component({

  selector: 'app-quiz-stats',
  standalone: true,
  imports: [CommonModule, NgForOf, QuizSessionHistoryComponent, SessionResultDetailsComponent],
  templateUrl: './quiz-stats.component.html',
  styleUrls: ['./quiz-stats.component.scss']

})

export class QuizStatsComponent {

  protected quiz: Quiz = EMPTY_QUIZ;
  public quizId: number = this.quiz.id;

  protected isSessionSelected: boolean = false;

  protected totalPlays = 0;
  protected averageTime = 0;
  protected averageHints = 0;
  protected averageAttempts = 0;
  protected quizResults: QuizResult[] = [];

  questionsStats: QuestionStat[] = [];
  selectedIndex: number = 0;

  public selectedSessionHistory: SessionHistory = EMPTY_SESSION_HISTORY;

  protected sessionHistory:SessionHistory[] = [];

  @Output()
  go_back: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('groupChart') groupChartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  constructor(private pageService: CurrentPageService,
    private statsService: StatsService,
    private quizListService: QuizListService,
    private computeStatisticService: ComputeStatisticService,
    private quizResultService: QuizResultService,
    private sessionResultService: SessionResultService) {
    this.statsService.quizId$.subscribe((quizId) => {
      this.quizId = quizId;
      this.quiz = this.quizListService.getQuiz(this.quizId)
      this.quizResults = this.quizResultService.getQuizResultsByQuiz(this.quizId);
      this.totalPlays = this.computeStatisticService.getNumberOfPlays(this.quizResults);
      this.averageTime = this.computeStatisticService.getAverageTotalTimeSpent(this.quizResults);
      this.averageHints = this.computeStatisticService.getAverageTotalHintsUsed(this.quizResults);
      this.averageAttempts = this.computeStatisticService.getAllAverageAttempts(this.quizResults)
    });

    this.sessionHistory = this.sessionResultService.formatQuizResultToSessionHistory(this.quizResults)

  }
  ngOnInit(): void {
    this.selectedIndex = 0;
    this.loadQuestions();
    this.renderChart();
    setTimeout(() => {
      if (this.groupChartRef) {
        this.renderChart();
      }
    });
  }

  public getQuiz() { return this.quiz }

  goBack() {
    { this.pageService.adminNav('selection-stat-quiz') }
  }

  loadQuestions(): void {
    this.questionsStats = this.quiz.questions.map(q => {
      // Construis la liste complète des réponses
      const opts = [
        ...q.answers.map(a => a.answerContent)
      ];

      //Retrieve All the questionResults for a given questionId
      const matchingQuestionResults = this.quizResults
        .flatMap(qr => qr.questionResults)
        .filter(qr => qr.questionId === q.id);

      let first: number[] = []
      let second: number[] = []
      let third: number[] = []
      let other: number[] = []

      q.answers.forEach((answer) => {
        first.push(this.computeStatisticService.countAllAnswersAtIndex(0, matchingQuestionResults, answer.id))
        second.push(this.computeStatisticService.countAllAnswersAtIndex(1, matchingQuestionResults, answer.id))
        third.push(this.computeStatisticService.countAllAnswersAtIndex(2, matchingQuestionResults, answer.id))
        other.push(this.computeStatisticService.countAllAnswersAtIndex(3, matchingQuestionResults, answer.id))
      })
      return {
        text: q.question,
        options: opts,
        pctFirst: first,
        pctSecond: second,
        pctThird: third,
        pctFourth: other,
        avgTime: this.computeStatisticService.getAverageTimeSpent(matchingQuestionResults),
        hintsUsed: this.computeStatisticService.getAverageHintUsed(matchingQuestionResults)
      };

    });
  }

  selectQuestion(idx: number) {
    this.selectedIndex = idx;
    if (this.chart) {
      this.chart.data = this.getChartData(idx);
      this.chart.update();
    }
  }

  private renderChart() {
    const ctx = this.groupChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const chartData = this.getChartData(this.selectedIndex);

    // Trouver la valeur maximale parmi toutes les données de toutes les datasets
    const maxValue = Math.max(
      ...chartData.datasets.flatMap(dataset => dataset.data as number[])
    );

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: Math.round(maxValue * 1.50), ticks: { callback: v => v } },
          x: { ticks: { autoSkip: false, font: { size: 10 } } }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private getChartData(idx: number) {
    const stat = this.questionsStats[idx];
    return {
      labels: stat.options,
      datasets: [
        { label: '1er essai', data: stat.pctFirst, backgroundColor: '#28a745' },
        { label: '2e essai', data: stat.pctSecond, backgroundColor: '#ffc107' },
        { label: '3e essai', data: stat.pctThird, backgroundColor: '#dc3545' },
        { label: '+ de 3 essais', data: stat.pctFourth, backgourndColor: '#EE7B26' }
      ]
    };
  }

  public getQuizId() { return this.quizId; }

  public viewSessionDetails(sessionId: string) {
  
    const tempSelectedSessionHistory = this.sessionHistory.find((sessionRes) => sessionRes.sessionId === sessionId);

    if (tempSelectedSessionHistory) {
      this.selectedSessionHistory = tempSelectedSessionHistory
      this.isSessionSelected = true;
    }


  }

  public navigateBack() {
    this.loadQuestions();
    this.renderChart();
    setTimeout(() => {
      if (this.groupChartRef) {
        this.renderChart();
      }
    });
    this.isSessionSelected = false;
  }

  public getSessionHistory(){ return this.sessionHistory; }

}

