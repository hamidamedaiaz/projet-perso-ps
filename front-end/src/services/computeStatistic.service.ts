import { Injectable } from "@angular/core";
import { forkJoin, map, Observable, of } from 'rxjs';
import { QuizResult } from "src/models/quiz-result.model";
import { Quiz } from "src/models/quiz.model";
import { QuestionResult } from "src/models/question-result.model";
import { QuizListService } from "./quiz-list.service";
import { EMPTY_QUIZ } from "src/mocks/quiz.mock";

@Injectable({
  providedIn: 'root'
})

export class ComputeStatisticService {

  private quizzes: Quiz[] = []

  constructor(private quizListService: QuizListService) {
    this.quizListService.quizzes$.subscribe((quizzes) => this.quizzes = quizzes)
  }

  public getAverageTime(questionResults: QuestionResult[]) {
    if(questionResults.length === 0) return 0;
    let totalTime = 0;
    questionResults.forEach(element => {
      totalTime += element.timeSpent;
    });
    return Math.round((totalTime / questionResults.length)/1000)
  }

  public getAverageHintUsed(questionResults: QuestionResult[]): number {
     if(questionResults.length === 0) return 0;
    let numberOfHintsUsed = 0;
    questionResults.forEach(element => {
      numberOfHintsUsed += element.numberOfHintsUsed;
    });
    return Math.floor(numberOfHintsUsed / questionResults.length)
  }


  public getAverageNumberOfTries(questionResults: QuestionResult[]): number {
     if(questionResults.length === 0) return 0;
    let numberOfAnswersSubmitted = 0;
    questionResults.forEach(element => {
      numberOfAnswersSubmitted += element.answerIds.length;
    });
    return Math.floor(numberOfAnswersSubmitted / questionResults.length)
  }

  public getTotalHintUsed(questionResults: QuestionResult[]): number {
    
    let hintCounter: number = 0;
    questionResults.forEach(element => {
      hintCounter += element.numberOfHintsUsed;
    })
    return hintCounter;
  }

  public isQuestionCorrect(quiz: Quiz, questionResult: QuestionResult): boolean {
    if (quiz.id != -1) {  //Check if the quiz is valid

      let question = quiz.questions.find((question) => question.id === questionResult.questionId);
      if (!question) { console.log("Error - Question Not Found "); return false; }
      const correctAnswerIds: number[] = question.answers  //Retrieve only correct answer Ids
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id)

      if (correctAnswerIds.every((id) => questionResult.answerIds.includes(id))) return true;

    }
    return false;
  }

  public getPercentages(score: number, numberOfQuestions: number): number {
    if(numberOfQuestions === 0) return 0;
    return Math.floor((score / numberOfQuestions) * 100);
  }

  public getScore(questionResults: QuestionResult[]) {
    let score = 0;
    let quiz = this.getQuizById(questionResults[0].quizId)
    questionResults.forEach((question) => {
      if (this.isQuestionCorrect(quiz, question)) score++;
    })
    return score;
  }

  public getTotalTimeSpent(quizResults: QuizResult[]) {
    let totalTimeSpent: number = 0;
    quizResults.forEach((quizResult) => quizResult.questionResults.forEach((questionResult) => {
      totalTimeSpent += questionResult.timeSpent;
    }))
    return totalTimeSpent
  }

  public convertTimeStampToDate(timestamp: number): string {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  private getQuizById(quizId: number): Quiz {
    let quiz = this.quizzes.find((quiz) => quiz.id === quizId);
    if (quiz) return quiz;
    return EMPTY_QUIZ;
  }



  public getTotalNumberOfQuestion(quizResults: QuizResult[]): number {
    let numberOfQuestion = 0;
    quizResults.forEach((quizResult) => {
      numberOfQuestion += quizResult.questionResults.length
    });
    return numberOfQuestion;
  }

  public getTotalNumberOfHintsUsed(quizResults: QuizResult[]): number {
    let numberOfHintsUsed = 0;
    quizResults.forEach((quizResult) => {
      quizResult.questionResults.forEach((questionResult) => {
        numberOfHintsUsed += questionResult.numberOfHintsUsed;
      })
    })
    return numberOfHintsUsed;
  }

  public getAverageTotalHintsUsed(quizResults: QuizResult[]) {
    if (quizResults.length === 0) return 0;
    let numberOfHintsUsed = this.getTotalNumberOfHintsUsed(quizResults);
    let numberOfQuestion = this.getTotalNumberOfQuestion(quizResults);
    if (numberOfQuestion < 1) return 0; // Avoid dividing by 0
    return Math.floor(numberOfHintsUsed / numberOfQuestion);
  }

  public getAverageTotalTimeSpent(quizResults: QuizResult[]): number {
    if (quizResults.length === 0) return 0;
    let numberOfQuestion = this.getTotalNumberOfQuestion(quizResults);
    let totalTimeSpent = this.getTotalTimeSpent(quizResults)
    return Math.round((totalTimeSpent / numberOfQuestion)/1000);
  }

  public getPercentageOfCorrectAnswer(quizResults: QuizResult[]): number {
    if (quizResults.length === 0) return 0;
    let percentage = 0;
    console.log("Quiz: ", quizResults)
    quizResults.forEach((quizResult) => {
      let quiz = this.getQuizById(quizResult.quizId);
      if (quiz.id === -1) return;
      percentage += this.getPercentages(this.getScore(quizResult.questionResults), quizResult.questionResults.length)
    })
    return Math.round(percentage / quizResults.length)
  }

  public getPercentageOfIncorrectAnswer(quizResults: QuizResult[]): number {
    if (quizResults.length === 0) return 0;
    return 100 - this.getPercentageOfCorrectAnswer(quizResults);
  }

  public getDataPerMonth(quizResults: QuizResult[], year: number ): { [month: string]: QuizResult[] } {
    const resultsByMonth: { [month: string]: QuizResult[] } = {};

    quizResults.forEach(result => {
      const date = new Date(result.dateDebut);
      const resultYear = date.getFullYear();

      if (resultYear === year) {
        const monthKey = `${resultYear}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!resultsByMonth[monthKey]) {
          resultsByMonth[monthKey] = [];
        }

        resultsByMonth[monthKey].push(result);
      }
    });

    // Optionally sort each month's results by dateDebut
    for (const month in resultsByMonth) {
      resultsByMonth[month].sort((a, b) => a.dateDebut - b.dateDebut);
    }

    return resultsByMonth;
  }

  getYearsPlayed(quizResults:QuizResult[]):number[]{
    const yearPlayed = [...new Set(quizResults.map(r => new Date(r.dateDebut).getFullYear()))];
    let currentYear:number  =new Date(Date.now()).getFullYear();
    if(!yearPlayed.includes(currentYear)) yearPlayed.push(currentYear)
    return yearPlayed;
  }

  getNumberOfPlays(quizResults:QuizResult[]){
    return quizResults.length;
  }

  getAverageAttempts(quizResult:QuizResult){
    let counter = 0
    quizResult.questionResults.forEach((questionResult) => {
      counter += questionResult.answerIds.length;
    })
    return counter / quizResult.questionResults.length
  }

  getAllAverageAttempts(quizResults:QuizResult[]){
    if(quizResults.length === 0) return 0;
    let attempsCounter = 0;
    quizResults.forEach((quizResult) => {
      attempsCounter += this.getAverageAttempts(quizResult);
    })
    return Math.round(attempsCounter/quizResults.length)
  }

  countAllAnswersAtIndex(index: number, questionResults: QuestionResult[], answerId: number): number {
  let count = 0;

  questionResults.forEach((qr) => {
    if (index <= 2) {
      if (qr.answerIds.length > index && qr.answerIds[index] === answerId) {
        count++;
      }
    } else {
      // On cherche si l'answerId apparaît dans une position supérieure à 3
      const hasMatchAfterIndex3 = qr.answerIds
        .slice(4) // positions 4 et au-delà
        .includes(answerId);

      if (hasMatchAfterIndex3) {
        count++;
      }
    }
  });

  return count;
}

}
