import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QuizHintsComponent } from '../quiz-hints/quiz-hints.component';
import { CommonModule } from '@angular/common';
import { Question } from 'src/models/question.model';
import { Answer } from 'src/models/answer.model';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { Router } from '@angular/router';
import { QuizService } from 'src/services/quiz.service';
import { GamemodeService } from 'src/services/gamemode.service';
import { MusicControlComponent } from '../music-control/music-control.component';
import { QuizQuestionHeaderComponent } from '../quiz-question-header/quiz-question-header.component';
import { QuizQuestionPopUpComponent } from '../quiz-question-pop-up/quiz-question-pop-up.component';
import { QuizAnswersComponent } from '../quiz-answers/quiz-answers.component';
import { RecordResultService } from 'src/services/record-result.service';
import { MultiPlayerInGameListComponent } from '../../multiplayer/multi-player-in-game-list/multiplayer-in-game-list.component';
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';


@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [
    CommonModule,
    MusicControlComponent,
    QuizHintsComponent,
    QuizQuestionHeaderComponent,
    QuizQuestionPopUpComponent,
    MultiPlayerInGameListComponent,
    QuizAnswersComponent],
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})

export class QuizQuestionComponent {

  @ViewChild('audio') audio!: ElementRef<HTMLAudioElement>;

  private question!: Question;

  private wrongAnswers: Answer[] = [];

  public showCorrectEffect: Boolean = false;

  public hintsActive: Boolean = false;

  public shuffledAnswers: Answer[] = [];

  public showQuestionPopUp: Boolean = false;

  private CORRECT_ANSWER_DELAY = 1500;

  private SHOW_POP_UP_TIMER = 10000;

  private hintTimer: any = null;

  private popUpTimer: any = null;

  private NUMBER_OF_PLAYER: number = 8;

  private GIVEN_ANSWERS_COUNTER: number = 5;

  private startTimeDate: number = -1;

  public isInteractionDisabled: boolean = false;


  constructor(private router: Router,
    public currentProfileService: CurrentProfileService,
    private quizService: QuizService,
    private gamemodeService: GamemodeService,
    private recordResultService: RecordResultService,
    private socketService: SocketService,
    private sessionService: SessionService) {

    this.startTimeDate = Date.now();

    this.currentProfileService.current_profile$.subscribe((profile) => {
      this.SHOW_POP_UP_TIMER = profile.SHOW_POP_UP_TIMER;
    })

    this.quizService.retrieveData$.subscribe((data) => {
      if (data) this.recordResultService.setTimeSpent(this.quizService.questionId, Date.now() - this.startTimeDate)
    })

    this.quizService.question$.subscribe((question) => {
      this.question = question;

      this.hintsActive = false;

      this.startTimeDate = Date.now();

      if (this.getRole() === 'user') {

        this.hintsActive = this.currentProfileService.getCurrentProfile().NUMBER_OF_HINTS_DISPLAYED != 0 && this.question.hints.length > 0;

        if (this.getGamemode().id === 0) {
          //SHOW POP-UP TIMER
          this.clearPopUpTimer();
          this.popUpTimer = setTimeout(() => {
            this.showQuestionPopUp = true;
          }, this.SHOW_POP_UP_TIMER)
        }
        if (this.question.hints.length > 0) {

          //SHOW HINT TIMER
          this.clearHintTimeOut();
        }
      }
    })

    this.socketService.emit('login', { sessionId: this.sessionService.getSessionId(),
      profile: this.currentProfileService.getCurrentProfile() })
  }

  public getGamemode() {
    return this.gamemodeService.getCurrentGamemode();
  }

  public getRole() {
    return this.currentProfileService.getCurrentProfile().role;
  }

  ngOnChanges() { this.resetQuestion(); }

  private clearHintTimeOut() {
    if (this.hintTimer) {
      clearTimeout(this.hintTimer)
      this.hintsActive = false;
    }
  }

  private clearPopUpTimer(): void {
    if (this.popUpTimer) {
      clearTimeout(this.popUpTimer)
      this.showQuestionPopUp = false;
    }
  }

  public showHints() {
    this.hintsActive = !this.hintsActive
  }

  public resetQuestion() {
    this.hintsActive = false;
    this.wrongAnswers = [];
    this.GIVEN_ANSWERS_COUNTER = 0;
  }


  public isWrongAnswer(answer: Answer): boolean {
    return this.wrongAnswers.some(
      wrong => wrong.id === answer.id && wrong.questionId === answer.questionId
    );
  }

  public getAllAnswers() { return this.question.answers; }

  public getTitle() { return this.question.question; }

  public getNbOfGivenAnswers(): number { return this.GIVEN_ANSWERS_COUNTER; }

  public getNbOfPlayers() { return this.NUMBER_OF_PLAYER; }

  public submitCorrectAnswer() {
    if (this.gamemodeService.getCurrentGamemode().id === 0) {
      this.showCorrectEffect = true;
      this.isInteractionDisabled = true;
      setTimeout(() => {
        this.showCorrectEffect = false;
        this.isInteractionDisabled = false;
      }, this.CORRECT_ANSWER_DELAY);
    }
    else if (this.gamemodeService.getCurrentGamemode().id === 1) {
      this.router.navigate(["/answer-submitted"]);
    }
  }

  public nextQuestion() {
    if (!this.isInteractionDisabled) {
      this.wrongAnswers = [];
      this.clearHintTimeOut();

      if (this.gamemodeService.getCurrentGamemode().id === 1) {
        this.socketService.emit('next-question-from-admin', { sessionId: this.sessionService.getSessionId() })
      } else {
        this.quizService.nextQuestion();
      }
    }
  }

  public validateQuestion() {
    if (this.gamemodeService.getCurrentGamemode().id == 0) {
      this.isInteractionDisabled = true;
      setTimeout(() => {
        this.nextQuestion();
        this.isInteractionDisabled = false;
      }, this.CORRECT_ANSWER_DELAY);
    }
  }

  public previousQuestion() {
    this.wrongAnswers = [];
    this.quizService.previousQuestion();
  }

  public areHintsActive(): Boolean {
    return this.hintsActive;
  }

  public getAudioPath(): string {
    return "http://localhost:9428/upload/" + this.question.audioPath;

  }

  public getVolume(): number { return 50; }

  public CancelPopPup() {
    this.showQuestionPopUp = false;
  }

  public isQuizRunning() {
    return this.quizService.isQuizRunning;
  }

}
