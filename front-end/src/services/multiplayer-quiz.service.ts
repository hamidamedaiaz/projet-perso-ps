import { Injectable, OnInit } from '@angular/core';
import { LocalStorageService } from './localstorage.service';
import { Answer } from 'src/models/answer.model';
import { Profile } from 'src/models/profile.model';
import { QuizService } from './quiz.service';
import { BehaviorSubject } from 'rxjs';
import { Quiz } from 'src/models/quiz.model';
import { SocketService } from './socket.service';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { Question } from 'src/models/question.model';
import { EMPTY_QUESTION } from 'src/mocks/question.mock';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class MultiPlayerQuizService {

  private readonly GIVEN_ANSWERS_KEY = 'current_score';

  private sessionId: string = "None";

  private givenAnswersAnswer: Answer[] = [];

  private players: Profile[] = [];

  public players$: BehaviorSubject<Profile[]> = new BehaviorSubject<Profile[]>([]);

  private PLAYERS_KEY: string = "PLAYERS";

  private quiz: Quiz | null = null;

  public quiz$: BehaviorSubject<Quiz> = new BehaviorSubject<Quiz>(EMPTY_QUIZ);

  public question$: BehaviorSubject<Question> = new BehaviorSubject<Question>(EMPTY_QUESTION)

  constructor(private localStorageService: LocalStorageService,
    private quizService: QuizService,
    private socketService: SocketService, 
    private router: Router) {
    //this.loadFromStorage();
    this.initSocketListening();
  }

  // Les services n'utilisent pas de ngOnInit, on vient donc mettre les listens dans le constructeur

  private initSocketListening(): void {
    this.socketService.listen('next-question', (data) => {
      if (this.sessionId === data.sessionId) {
        this.setQuestion(data.question);
        console.log(data.question);
        this.router.navigate(['/multiplayer-game'])
      }
    })
  }

  private loadFromStorage(): void {
    const players = this.localStorageService.getItem(this.PLAYERS_KEY);
    const givenAnswersAnswer = this.localStorageService.getItem(this.GIVEN_ANSWERS_KEY);
    if (players) this.players = players;
    if (givenAnswersAnswer) this.givenAnswersAnswer = givenAnswersAnswer;
  }

  public getNumberOfGivenAnswers(): number {
    return this.givenAnswersAnswer.length;
  }

  public addPlayer(profile: Profile) {
    if (this.players.includes(profile)) return;
    this.players.push(profile);
    this.players$.next(this.players)
    this.localStorageService.removeItem(this.PLAYERS_KEY)
    this.localStorageService.storeItem(this.PLAYERS_KEY, JSON.stringify(this.players));
  }

  public addGivenAnswer(answer: Answer) {
    this.givenAnswersAnswer.push(answer);
    this.localStorageService.removeItem(this.GIVEN_ANSWERS_KEY);
    this.localStorageService.storeItem(this.GIVEN_ANSWERS_KEY, JSON.stringify(this.givenAnswersAnswer));
  }

  public getNumberOfPlayers(): number {
    return this.players.length;
  }

  public getPlayers(): Profile[] { return this.players; }

  public removePlayerById(playerId: number) {
    this.players = this.players.filter((p) => p.id !== playerId);
    this.players$.next(this.players);
  }

  public startQuiz() {
    this.socketService.emit("start-session", { players: this.players, sessionId: this.sessionId });
    //this.quizService.startQuiz();
  }

  public getSessionId(): string { return this.sessionId }

  public async setQuiz(quiz: Quiz) {
    this.quiz = quiz;
    this.socketService.emit('generate-new-session', quiz);
    const data = await this.socketService.listenOnce('session-created');
    this.sessionId = data.id
    this.quiz$.next(this.quiz)
  }

  public leaveSetup() {
    this.players = []
    this.players$.next(this.players);
    this.socketService.emit('leave-setup', { sessionId: this.sessionId });
    this.resetCurrentQuiz();
  }

  public resetCurrentQuiz(): void {
    this.quiz = EMPTY_QUIZ;
    this.sessionId = "None";
    this.players = [];
    this.players$.next(this.players);
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  public setQuestion(question: Question) {
    if(question.id !== -1 ) this.quizService.setQuestion(question.id);
  }

}

