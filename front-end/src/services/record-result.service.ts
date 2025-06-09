import { Injectable } from '@angular/core';
import { QuizResult } from 'src/models/quiz-result.model';
import { CurrentProfileService } from './currentProfile.service';
import { GamemodeService } from './gamemode.service';
import { QuestionResult } from 'src/models/question-result.model';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { Quiz } from 'src/models/quiz.model';
import { QUIZ_RESULT_EMPTY } from 'src/mocks/quiz-results.mock';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordResultService {

  private quizResult: QuizResult = QUIZ_RESULT_EMPTY;
  private sessionId: number = -1;

  private readonly QUIZ_RESULT_KEY: string = "QUIZ_RESULT_KEY";

  public currentStartTime: number = -1;
  public currentEndTime: number = -1;
  public currentAnswerIds: number[] = [];
  public currentNumberOfHintsUsed: number = 0;
  private quiz: Quiz = EMPTY_QUIZ;


  constructor(
    private currentProfileService: CurrentProfileService,
    private gamemodeService: GamemodeService, private localStorageService: LocalStorageService) {
    this.loadLocalStorage();
  }


  public startRecording() {
    this.resetQuizResult();
    this.fillEmptyQuestionResult();
    this.localStorageService.removeItem(this.QUIZ_RESULT_KEY)
    this.localStorageService.storeItem(this.QUIZ_RESULT_KEY, JSON.stringify(this.quizResult));
  }

  private loadLocalStorage() {
    const savedQuizResult = this.localStorageService.getItem(this.QUIZ_RESULT_KEY)
    if (savedQuizResult) this.quizResult = savedQuizResult;
  }

  public getQuizResult() { return this.quizResult; }

  public getQuestionResult(questionId: number) {
    if (questionId !== -1) {
      return this.quizResult.questionResults[questionId];
    }
    return this.generateEmptyQuestionResult(-1);
  }

  public setTimeSpent(questionId: number, timeSpent: number) {
    console.log("RESULT QuestionId ", questionId)
    console.log(this.quizResult.questionResults)
    if (questionId !== -1) {
      this.quizResult.questionResults[questionId].timeSpent += timeSpent;
    }
  }

  public setUserAnswersIds(questionId: number, userAnswersIds: number[]) {
    if (questionId !== -1) {
      this.quizResult.questionResults[questionId].answerIds = userAnswersIds;
    }
  }

  public setNumberOfHintsUsed(questionId: number, numberOfHintsUsed: number) {
    if (questionId !== -1 && numberOfHintsUsed > this.quizResult.questionResults[questionId].numberOfHintsUsed) {
      this.quizResult.questionResults[questionId].numberOfHintsUsed = numberOfHintsUsed;
    }
  }

  public resetQuizResult() {
    this.quizResult = this.getEmptyQuizResult();
  }

  public stopRecording() {
    this.quizResult.dateFin = Date.now();
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
    this.sessionId = this.getRandomIndex();
    const quizResult: QuizResult = {
      id: 0,
      sessionId: this.sessionId,
      quizId: this.quiz.id,
      profileId: this.currentProfileService.getCurrentProfile().id,
      dateDebut: Date.now(),
      dateFin: -1,
      questionResults: [],
      gamemode: this.gamemodeService.getCurrentGamemode()
    }
    return quizResult;
  }

  private fillEmptyQuestionResult() {
    this.quiz.questions.forEach(element => {
      this.quizResult.questionResults.push(this.generateEmptyQuestionResult(element.id));
    });
  }

  public setQuiz(quiz: Quiz) {
    if (quiz.id !== -1) this.quiz = quiz;
  }

}



