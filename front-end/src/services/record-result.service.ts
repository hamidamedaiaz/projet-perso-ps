


import { Injectable } from '@angular/core';
import { QuizResult } from 'src/models/quiz-result.model';
import { CurrentProfileService } from './currentProfile.service';
import { GamemodeService } from './gamemode.service';
import { QuestionResult } from 'src/models/question-result.model';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { Quiz } from 'src/models/quiz.model';
import { QUIZ_RESULT_EMPTY } from 'src/mocks/quiz-results.mock';
import { LocalStorageService } from './localstorage.service';
import { Player } from 'src/models/player.model';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class RecordResultService {

  private quizResult: QuizResult = QUIZ_RESULT_EMPTY;
  private sessionId: string = "None";

  private readonly QUIZ_RESULT_KEY: string = "QUIZ_RESULT_KEY";

  public currentStartTime: number = -1;
  public currentEndTime: number = -1;
  public currentAnswerIds: number[] = [];
  public currentNumberOfHintsUsed: number = 0;
  private quiz: Quiz = EMPTY_QUIZ;

  public disabled: boolean = false;


  constructor(
    private currentProfileService: CurrentProfileService,
    private gamemodeService: GamemodeService,
    private localStorageService: LocalStorageService,
    private profileService: ProfileService) {
    this.loadLocalStorage();
    this.currentProfileService.current_profile$.subscribe((profile) => {
      if (profile) this.disabled = (profile.role === 'admin');
    })
  }


  public startRecording() {

    if (!this.disabled) {
      this.resetQuizResult();
      this.fillEmptyQuestionResult();
      this.localStorageService.removeItem(this.QUIZ_RESULT_KEY)
      this.localStorageService.storeItem(this.QUIZ_RESULT_KEY, JSON.stringify(this.quizResult));
    }
  }

  private loadLocalStorage() {
    const savedQuizResult = this.localStorageService.getItem(this.QUIZ_RESULT_KEY)
    if (savedQuizResult) this.quizResult = savedQuizResult;
  }

  public setPlayers(players: Player[]): void {
    if (!this.disabled) {
      if (this.gamemodeService.getCurrentGamemode().id === 1) {
        players.forEach(player => {
          const profile = this.profileService.getProfileById(player.profile.id);
          const alreadyExists = this.quizResult.players.some(p => p.id === profile.id);
          if (!alreadyExists) {
            this.quizResult.players.push(profile);
          }
        });
      }
    }
  }

  public getQuizResult() { return this.quizResult; }

  public getQuestionResult(questionId: number) {
    if (questionId !== -1 && !this.disabled) {
      return this.quizResult.questionResults[questionId];
    }
    return this.generateEmptyQuestionResult(-1);
  }

  public setTimeSpent(questionId: number, timeSpent: number) {
    if (questionId !== -1 && !this.disabled) {
      this.quizResult.questionResults[questionId].timeSpent += timeSpent;
    }
  }

  public setUserAnswersIds(questionId: number, userAnswersIds: number[]) {
    if (questionId !== -1 && !this.disabled) {
      this.quizResult.questionResults[questionId].answerIds = userAnswersIds;
    }
  }

  public setNumberOfHintsUsed(questionId: number, numberOfHintsUsed: number) {
    if (questionId !== -1 && numberOfHintsUsed > this.quizResult.questionResults[questionId].numberOfHintsUsed && !this.disabled) {
      this.quizResult.questionResults[questionId].numberOfHintsUsed = numberOfHintsUsed;
    }
  }

  public resetQuizResult() {
    this.quizResult = this.getEmptyQuizResult();
  }

  public stopRecording() {
    if (!this.disabled) {
      console.log('[CLIENT] Stop recording')
      this.quizResult.dateFin = Date.now();
      console.log(this.quizResult)
    }
  }

  private generateEmptyQuestionResult(questionId: number): QuestionResult {
    return {
      id: this.getRandomIndex(),
      quizId: this.quiz.id,
      questionId: questionId,
      answerIds: [],
      timeSpent: 0,
      numberOfHintsUsed: 0
    }
  }

  private getRandomIndex() {
    const min = 1000000000;
    const max = Date.now();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getEmptyQuizResult(): QuizResult {
    const quizResult: QuizResult = {
      id: 0,
      sessionId: this.sessionId,
      quizId: this.quiz.id,
      profileId: this.currentProfileService.getCurrentProfile().id,
      dateDebut: Date.now(),
      dateFin: -1,
      questionResults: [],
      gamemode: this.gamemodeService.getCurrentGamemode(),
      players: [this.currentProfileService.getCurrentProfile()]
    }
    return quizResult;
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
    this.quizResult.sessionId = sessionId;
  }

  private fillEmptyQuestionResult() {
    this.quizResult.sessionId = this.sessionId
    this.quizResult.players = [];

    if (this.gamemodeService.getCurrentGamemode().id === 0) this.setSessionId(this.generateRandomSessionId());
    
    this.quiz.questions.forEach(element => {
      this.quizResult.questionResults.push(this.generateEmptyQuestionResult(element.id));
    });
    
  }

  private generateRandomSessionId() {
    return [...crypto.getRandomValues(new Uint8Array(3))]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();;
  }

  public setQuiz(quiz: Quiz) { if (quiz.id !== -1 && !this.disabled) this.quiz = quiz; }

}



