import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { QuizResult } from 'src/models/quiz-result.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';

@Component({
  selector: 'app-player-stats-progression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-stats-progression.component.html',
  styleUrls: ['./player-stats-progression.component.scss']
})
export class PlayerStatsProgressionComponent implements AfterViewInit, OnChanges {

  @Input() quizResultsOfTheYear!: { [month: string]: QuizResult[]; };
  @Input() activeTab: 'score' | 'hints' | 'time' | 'accuracy' = 'score';
  @Input() yearsPlayed:number[] = [];
  @Input() activeYear: number = this.getCurrentYear();
  
  @Output() tabChange = new EventEmitter<'score' | 'hints' | 'time' | 'accuracy'>();
  @Output() yearChange = new EventEmitter<number>();

  @ViewChild('progressChartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private computeStatisticService: ComputeStatisticService) {

  }

  private getCurrentYear(): number { return new Date(Date.now()).getFullYear() }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes['monthlyPerformance'] || changes['activeTab'] || changes['activeYear'])) {
      this.updateChart();
    }
  }

  setActiveTab(tab: 'score' | 'hints' | 'time' | 'accuracy') {
    this.tabChange.emit(tab);
  }

  setActiveYear(year:number){
    this.activeYear = year;
    this.yearChange.emit(year);
  }

  getTabLabel(tab: string): string {
    switch (tab) {
      case 'score': return 'Score global';
      case 'hints': return 'Utilisation des indices';
      case 'time': return 'Temps de réponse';
      case 'accuracy': return 'Précision';
      default: return '';
    }
  }

  initChart() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: this.getChartData(),
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.getYAxisLabel()
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => this.formatTooltipValue(context.parsed.y)
            }
          }
        }
      }
    });

  }

  getYAxisLabel(): string {
    switch (this.activeTab) {
      case 'time': return 'Temps (s)';
      case 'score': return 'Bonne réponses %';
      case 'accuracy': return 'Precision %';
      case 'hints': return 'Utilisation des indices ';
      default: return '%';
    }
  }

  formatTooltipValue(value: number): string {
    switch (this.activeTab) {
      case 'time':
        return `${value.toFixed(1)} s`;
      default:
        return `${value}%`;
    }
  }


  updateChart() {
    const data = this.getChartData();
    this.chart.data = data;

    (this.chart.options!.scales!['y'] as any).title.text = this.getYAxisLabel();
    this.chart.options!.plugins!.tooltip!.callbacks = {
      label: context => this.formatTooltipValue(context.parsed.y)
    };

    this.chart.update();
  }


  getChartData() {
    
    const labels = this.generateMonthLabel(this.activeYear);

    const hintUsed = labels.map(month =>
      this.quizResultsOfTheYear[month]?.length // Permet de vérifier s'il existe bien des données pour cette date
        ? this.computeStatisticService.getAverageTotalHintsUsed(this.quizResultsOfTheYear[month])
        : 0
    );


    const averageTimes = labels.map(month =>
      this.quizResultsOfTheYear[month]?.length // Permet de vérifier s'il existe bien des données pour cette date
        ? this.computeStatisticService.getAverageTotalTimeSpent(this.quizResultsOfTheYear[month])
        : 0
    );

    const score = labels.map(month =>
      this.quizResultsOfTheYear[month]?.length // Permet de vérifier s'il existe bien des données pour cette date
        ? this.computeStatisticService.getPercentageOfCorrectAnswer(this.quizResultsOfTheYear[month])
        : 0
    );

    let data: number[] = [];
    if (this.activeTab === 'time') { data = averageTimes }
    else if (this.activeTab === 'hints') { data = hintUsed }
    else if (this.activeTab === 'score') { data = score }

    return {
      labels: labels,
      datasets: [
        {
          label: labels[0],
          data: data,
          backgroundColor: '#1e88e5'
        }
      ]
    };
  }

  private generateMonthLabel(year: number) {
    if (year === -1) year = this.getCurrentYear();
    let labels: string[] = []
    for (let i = 1; i < 13; i++) {
      if (i < 10) labels.push(year + "-0" + i);
      else labels.push(year + "-" + i);
    }
    return labels
  }
}
