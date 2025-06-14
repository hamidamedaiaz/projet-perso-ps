import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { QuizService } from 'src/services/quiz.service';
import { Answer } from 'src/models/answer.model';
import { QuizAnswerComponent } from '../quiz-answer/quiz-answer.component';
import { QuizAnswerMultiplayerComponent } from '../quiz-answer-multiplayer/quiz-answer-multiplayer.component';
import { RecordResultService } from 'src/services/record-result.service';
import { GamemodeService } from 'src/services/gamemode.service';
import { SocketService } from 'src/services/socket.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/services/session.service';
import { RealTimeStatsService } from 'src/services/real-time-stats.service';
import { LocalStorageService } from 'src/services/localstorage.service';


@Component({
  selector: 'app-quiz-answers',
  standalone: true,
  imports: [CommonModule, QuizAnswerComponent, QuizAnswerMultiplayerComponent],
  templateUrl: './quiz-answers.component.html',
  styleUrl: './quiz-answers.component.scss'
})
export class QuizAnswersComponent {

  private answers: Answer[] = [];

  private selectedAnswers: Answer[] = [];

  private hiddenAnswers: Answer[] = [];

  private REMOVE_WRONG_ANSWER_INTERVAL: number = 0;

  private removeWrongAnswerInterval: any;

  public numberOfCorrectAnswer: number = -1;

  private ANSWERS_KEY:string = "ANSWERS_KEY";

  @Input()
  isInteractionDisabled: boolean = false;

  @Input()
  characterSize : string = "";

  @Output()
  correct_answer: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  @Output()
  next_question: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private currentProfileService: CurrentProfileService,
    private quizService: QuizService,
    private recordResultService: RecordResultService,
    private gamemodeService: GamemodeService,
    private socketService: SocketService,
    private router: Router,
    private sessionService: SessionService,
    private realTimeStatsService: RealTimeStatsService,
    private localStorageService: LocalStorageService) {

    this.currentProfileService.current_profile$.subscribe((profile) => {
      this.REMOVE_WRONG_ANSWER_INTERVAL = profile.REMOVE_WRONG_ANSWER_INTERVAL;
    })

    this.quizService.retrieveData$.subscribe((data) => {
      if (data) {
        let userAnswersIds = this.selectedAnswers.map(r => r.id);
        this.recordResultService.setUserAnswersIds(this.quizService.questionId, userAnswersIds)
      }
    })

    this.quizService.question$.subscribe((question) => {
      this.answers = question.answers;

      this.selectedAnswers = [];

      this.numberOfCorrectAnswer = this.getNumberOfCorrentAnswers(question.answers);

      // Nettoyage d'un éventuel intervalle précédent
      if (this.removeWrongAnswerInterval) {
        clearInterval(this.removeWrongAnswerInterval);
      }

      this.localStorageService.removeItem(this.ANSWERS_KEY)
      this.localStorageService.storeItem(this.ANSWERS_KEY, JSON.stringify(this.answers))

      this.removeWrongAnswerInterval = setInterval(() => {
        const wrongAnswers = (this.answers.filter((answer => !answer.isCorrect)))
        if (wrongAnswers.length > 0) {
          const answerToRemove = wrongAnswers.shift();
          if (answerToRemove) {
            this.hiddenAnswers.push(answerToRemove)
          }
        } else {
          clearInterval(this.removeWrongAnswerInterval); // stoppe l'intervalle si plus de mauvaises réponses
        }
      }, this.REMOVE_WRONG_ANSWER_INTERVAL);
    });

    this.loadLocalStorage();
  }


  private loadLocalStorage(){
    const savedAnswers = this.localStorageService.getItem(this.ANSWERS_KEY);
    if(savedAnswers) this.answers = savedAnswers;
  }

  public getRole() {
    return this.currentProfileService.getCurrentProfile().role;
  }

  public getAnswers() {
    this.answers.filter((answer) => !this.hiddenAnswers.includes(answer));
    //console.log(this.answers);
    return this.answers;
  }

  public isWrongAnswer(answer: Answer) {
    return answer.isCorrect;
  }

  public answerSelected(answer: Answer) {
    if (!this.isInteractionDisabled) {
      if (this.gamemodeService.getCurrentGamemode().id === 1) {
        this.selectedAnswers.push(answer);
        this.socketService.emit('submit-answer',
          {
            sessionId: this.sessionService.getSessionId(),
            profile: this.currentProfileService.getCurrentProfile(),
            answer: answer
          });
        this.router.navigate(['/answer-submitted'])

      } else if (this.gamemodeService.getCurrentGamemode().id === 0) {
        if (answer.isCorrect) {
          this.quizService.increaseScore(answer);
          this.selectedAnswers.push(answer);
          const lastCorrectAnswers = this.answers.filter((answer) => answer.isCorrect && !this.selectedAnswers.includes(answer));
          if (lastCorrectAnswers.length == 0) {
            this.correct_answer.emit(true);
            this.next_question.emit(true);
          }
        } else {
          this.selectedAnswers.push(answer);
          this.hiddenAnswers.push(answer);
        }
      }

    }
  }

  public isAnswerHidden(answer: Answer) {
    return this.hiddenAnswers.includes(answer);
  }

  public getMultiplayerAnswers() {
    // on  Recuperee la question courante
    const currentQuestion = this.quizService.question$.getValue();

    if (currentQuestion && currentQuestion.id !== -1) {
      const questionStats = this.realTimeStatsService.getQuestionStats(currentQuestion.id);

      if (questionStats) {
        // on  Applique les pourcentages reeels
        this.answers.forEach(answer => {
          const percentage = questionStats.percentages.get(answer.id) || 0;
          answer.stats = percentage;
        });
      } else {
        //  si  Pas encore de reponses, tout ===> 0%
        this.answers.forEach(answer => {
          answer.stats = 0;
        });
      }
    }

    return this.answers;
  }

  private getNumberOfCorrentAnswers(answers: Answer[]) {
    let counter = 0;
    answers.forEach((answer) => {
      if (answer.isCorrect) counter++;
    })
    return counter;
  }

}
