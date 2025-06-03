import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quiz-hint',
  standalone: true,
  imports: [],
  templateUrl: './quiz-hint.component.html',
  styleUrl: './quiz-hint.component.scss'
})
export class QuizHintComponent {

  @Input()
  hint!: String;

}
