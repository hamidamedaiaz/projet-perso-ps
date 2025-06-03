import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss'
})
export class AnswerComponent {

  @Input() answer : string = "";
  @Input() isCorrect : boolean = false;
  @Output() answerChange = new EventEmitter<string>();
  @Output() correctChange = new EventEmitter<boolean>();
  @Output() deleteEvent = new EventEmitter<boolean>();

  setCorrect(){
    this.isCorrect = !this.isCorrect;
    this.correctChange.emit(this.isCorrect);
  }

  deleteAnswer() {
    console.log("DEBUG - Suppression déclenchée !");
    this.deleteEvent.emit(true);
  }


}
