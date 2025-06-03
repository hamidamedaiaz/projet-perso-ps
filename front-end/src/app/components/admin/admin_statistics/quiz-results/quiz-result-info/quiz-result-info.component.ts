import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from 'src/models/quiz.model';
import { Profile } from 'src/models/profile.model';
import { QuestionResult } from 'src/models/question-result.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';

@Component({
  selector: 'app-quiz-result-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result-info.component.html',
  styleUrls: ['./quiz-result-info.component.scss']
})
export class QuizResultInfoComponent {
  @Input() quiz!: Quiz;
  @Input() profile!: Profile;
  @Input() date!:number;
  @Input() questionResults!: QuestionResult[];

  constructor(private computeStatisticService:ComputeStatisticService){}
  
  getScore(){ console.log(this.computeStatisticService.getScore(this.questionResults)); return this.computeStatisticService.getScore(this.questionResults) }

  getTotalQuestions():number{ return this.quiz.questions.length; }

  getPercentages(){ return this.computeStatisticService.getPercentages(this.getScore(), this.getTotalQuestions()) }
  
  getDate(){
    return this.computeStatisticService.convertTimeStampToDate(this.date);
  }

  getAverageTimePerQuestions(){ return this.computeStatisticService.getAverageTime(this.questionResults); }

  getTotalHintsUsed(){ return this.computeStatisticService.getTotalHintUsed(this.questionResults) }

  getScoreClass(): string {
    let percent:number = this.computeStatisticService.getPercentages(this.getScore(),this.getTotalQuestions())
    if ( percent >= 70) return 'grande-score';

    else if (percent >= 50) return 'moyenne-score';
    
    return 'petite-score';
  }

  

}