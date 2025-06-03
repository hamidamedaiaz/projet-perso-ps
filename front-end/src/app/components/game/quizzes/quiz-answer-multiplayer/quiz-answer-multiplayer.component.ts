import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from 'src/models/answer.model';
import { RealTimeStatsService } from 'src/services/real-time-stats.service';
import { QuizService } from 'src/services/quiz.service';


@Component({
  selector: 'app-quiz-answer-multiplayer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-answer-multiplayer.component.html',
  styleUrl: './quiz-answer-multiplayer.component.scss'
})
export class QuizAnswerMultiplayerComponent implements OnInit {

  @Input()
  answer!:Answer;

  constructor( private realTimeStatsService: RealTimeStatsService,
    private quizService: QuizService){}


  ngOnInit() {
    // s'abonne aux changements de stats  pendant un session  
    this.realTimeStatsService.currentSessionStats$.subscribe(sessionStats => {
      const currentQuestion = this.quizService.question$.getValue();
      if (currentQuestion && currentQuestion.id !== -1) {
        const questionStats = sessionStats.get(currentQuestion.id);
        if (questionStats) {
          // mettre a jour le pourcentage pour cette reponse
          const percentage = questionStats.percentages.get(this.answer.id) || 0;
          this.answer.stats = percentage;
        }
      }
    });
  }
}