import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-quiz-result-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result-header.component.html',
  styleUrls: ['./quiz-result-header.component.scss']

})
export class QuizResultHeaderComponent {
  title: string = 'Résultat du Quiz';

  @Output() show_pop_up = new EventEmitter();
  @Output() goBack = new EventEmitter();

  constructor() { }

  goback(): void { this.goBack.emit() }

  showPopUp() { this.show_pop_up.emit(true); }

}