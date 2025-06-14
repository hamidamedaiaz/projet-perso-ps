import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';
import { QuizService } from 'src/services/quiz.service';
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { LocalStorageService } from 'src/services/localstorage.service';

@Component({
  selector: 'app-answer-submitted',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-submitted-page.component.html',
  styleUrl: './answer-submitted-page.component.scss'
})
export class AnswerSubmittedPageComponent {

  public show_result: Boolean = false;

  public correctAnswer: Boolean = false;

  private valideQuestionTimer: any;

  private VALID_QUESTION_TIME: number = 999999;

  private MESSAGE_KEY: string = "MESSAGE_KEY";
  private SHOW_RESULT_KEY: string = "SHOW_RESULT_KEY";
  private IS_ANSWER_CORRECT_kEY: string = "IS_ANSWER_CORRECT"

  public message = "None";

  constructor(private currentProfileService: CurrentProfileService,
    private sessionService: SessionService,
    private socketService: SocketService,
    private localStorageService: LocalStorageService) {
  }


  ngOnInit(): void {

    this.correctAnswer = false;
    this.show_result = false;

    this.clearTimer();
    this.sessionService.connect()

    this.loadLocalStorage();

    this.socketService.listen('correct-answer', (data) => {
      console.log('correct-answer - ', data);
      if (data.sessionId === this.sessionService.getSessionId()) {
        this.message = "Bonne réponse !"
        this.localStorageService.storeItem(this.MESSAGE_KEY, JSON.stringify(this.message));
        this.correctAnswer = true;
      }
    })

    this.socketService.listen('wrong-answer', (data) => {
      console.log('wrong answer - ', data)
      if (data.sessionId === this.sessionService.getSessionId()) {
        this.message = "Dommage, bien essayé !"
        this.correctAnswer = false;
      }
      this.localStorageService.storeItem(this.MESSAGE_KEY, JSON.stringify(this.message));
      this.localStorageService.storeItem(this.IS_ANSWER_CORRECT_kEY, JSON.stringify(this.correctAnswer))
    })

    this.socketService.listen('every-one-answered', (data) => {
      if (data.sessionId === this.sessionService.getSessionId()) {
        this.showResult();
      }
    })
  }

  private loadLocalStorage(): void {
    const savedMessage = this.localStorageService.getItem(this.MESSAGE_KEY);
    if (savedMessage) this.message = savedMessage;

    const savedIsCorrectAnswer = this.localStorageService.getItem(this.IS_ANSWER_CORRECT_kEY);
    if (savedIsCorrectAnswer) this.correctAnswer = savedIsCorrectAnswer;

    const savedShowResult = this.localStorageService.getItem(this.SHOW_RESULT_KEY);
    if (savedShowResult) this.show_result = savedShowResult;
  }

  private showResult(): void {
    this.show_result = true;
    this.localStorageService.storeItem(this.IS_ANSWER_CORRECT_kEY, JSON.stringify(this.correctAnswer))
    this.valideQuestionTimer = setTimeout(() => {
    }, this.VALID_QUESTION_TIME);
  }

  private clearTimer(): void {
    if (this.valideQuestionTimer) {
      clearTimeout(this.valideQuestionTimer)
    }
  }

}
