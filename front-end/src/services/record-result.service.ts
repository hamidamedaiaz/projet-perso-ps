import { Injectable } from '@angular/core';
import { QuizResult } from 'src/models/quiz-result.model';
import { CurrentProfileService } from './currentProfile.service';
import { GamemodeService } from './gamemode.service';
import { QuestionResult } from 'src/models/question-result.model';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { Quiz } from 'src/models/quiz.model';
import { QUIZ_RESULT_EMPTY } from 'src/mocks/quiz-results.mock';

@Injectable({
  providedIn: 'root'
})
export class RecordResultService {

  private quizResult: QuizResult = QUIZ_RESULT_EMPTY;
  private sessionId: number = -1;

  public currentStartTime:number = -1;
  public currentEndTime:number = -1;
  public currentAnswerIds:number[] = [];
  public currentNumberOfHintsUsed:number = 0;
  private quiz:Quiz = EMPTY_QUIZ;


  constructor(
    private currentProfileService: CurrentProfileService,
    private gamemodeService: GamemodeService) {}


  public startRecording() {
    this.resetQuizResult();
    this.fillEmptyQuestionResult();
  }

  public getQuizResult() { return this.quizResult; }

  public getQuestionResult(questionId: number) {
    if (questionId !== -1) {
      return this.quizResult.questionResults[questionId];
    }
    return this.generateEmptyQuestionResult(-1);
  }

  public setTimeSpent(questionId: number, timeSpent: number) {
    console.log(questionId," - ", timeSpent)
    if (questionId !== -1) {
      this.quizResult.questionResults[questionId].timeSpent += timeSpent;
    }
  }

  public setUserAnswersIds(questionId: number, userAnswersIds: number[]) {
    console.log(questionId," - ", userAnswersIds)
    if (questionId !== -1) {
      this.quizResult.questionResults[questionId].answerIds = userAnswersIds;
    }
  }

  public setNumberOfHintsUsed(questionId: number, numberOfHintsUsed: number) {
    console.log(questionId," - ", numberOfHintsUsed)
    if (questionId !== -1 && numberOfHintsUsed > this.quizResult.questionResults[questionId].numberOfHintsUsed) {
      this.quizResult.questionResults[questionId].numberOfHintsUsed = numberOfHintsUsed;
    }
  }

  public resetQuizResult() {
    this.quizResult = this.getEmptyQuizResult();
  }

  public stopRecording(){
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

  public setQuiz(quiz:Quiz){
    if(quiz.id !== -1) this.quiz = quiz; 
  }

}



