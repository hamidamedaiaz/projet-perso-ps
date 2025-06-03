import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-quiz-question-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './quiz-question-pop-up.component.html',
  styleUrl: './quiz-question-pop-up.component.scss'
})
export class QuizQuestionPopUpComponent {

  @Output()
  cancel_pop_pup: EventEmitter<Boolean> = new EventEmitter<Boolean>(); 

  @Output()
  continue_pop_pup: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  private message:string = "Voulez-vous passer à la question suivante ?";

  constructor(){}

  public getMessage():string{ return this.message }

  public cancelPopUp():void{ this.cancel_pop_pup.emit(true); }

  public continuePopUp():void { this.continue_pop_pup.emit(true)}

}
