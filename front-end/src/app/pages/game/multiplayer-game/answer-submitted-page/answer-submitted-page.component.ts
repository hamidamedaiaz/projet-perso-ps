import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';
import { QuizService } from 'src/services/quiz.service';
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';

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

  public message = "None";

  constructor(private router: Router,
    private sessionService: SessionService,
    private socketService: SocketService) {
    this.message = "None";
    this.correctAnswer = false;
    this.show_result = false;
    this.clearTimer();
  }


  ngOnInit(): void {

    this.socketService.listen('correct-answer', (data) => {
      console.log('correct-answer - ', data);
      if (data.sessionId === this.sessionService.getSessionId()) {
        this.message = "Bonne réponse !"
        this.correctAnswer = true;
      }
    })

    this.socketService.listen('wrong-answer', (data) => {
      console.log('wrong answer - ', data)
      if (data.sessionId === this.sessionService.getSessionId()) this.message = "Dommage, bien essayé !"
    })

    this.socketService.listen('every-one-answered', (data) => {
      if (data.sessionId === this.sessionService.getSessionId()) this.showResult();
    })

  }

  private showResult() {
    this.show_result = true;
    this.valideQuestionTimer = setTimeout(() => {
    }, this.VALID_QUESTION_TIME);
  }

  private clearTimer(): void {
    if (this.valideQuestionTimer) {
      clearTimeout(this.valideQuestionTimer)
    }
  }





}
