import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from 'src/models/answer.model';

@Component({
  selector: 'app-quiz-answer-multiplayer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-answer-multiplayer.component.html',
  styleUrl: './quiz-answer-multiplayer.component.scss'
})
export class QuizAnswerMultiplayerComponent {

  @Input()
  answer!:Answer;

  constructor(){}
}
