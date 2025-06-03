import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Quiz } from "../models/quiz.model";
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';

@Injectable({
  providedIn: 'root'
})
export class QuizListService {
  private apiUrl = 'http://localhost:9428/api/quizzes';
  public quizzes$: BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  private quizzes: Quiz[] = []
  public selectedEditQuiz$ = new BehaviorSubject<Quiz | null>(null);

  constructor(private http: HttpClient) {
    this.getQuizzes();
  }

  public getQuizzes(): void {
    this.http.get<Quiz[]>(this.apiUrl).subscribe((quizzes: Quiz[]) => {
      console.log("Quizzes récupérés :", quizzes);
      this.quizzes = quizzes;
      this.quizzes$.next(quizzes)
    });
  }

  public getQuiz(quizId: number): Quiz {
    let quiz = this.quizzes.find((quiz) => quiz.id === quizId)
    if(quiz) return quiz;
    return EMPTY_QUIZ;
  }

  public RequestEditQuizzes(q: Quiz): void {

    this.isQuizCorrect(q);

    console.log("[SERVER REQUEST] - Request edition : ", q)

    this.http.post<Quiz>(this.apiUrl, q).subscribe({
      next: (res) => {
        console.log("[SERVER RESPONSE] - ", res)
        this.getQuizzes();
      },
      error: (err) => console.error("[SERVER ERROR] - ", err)

    });
  }

  public createQuiz(): void {
    const newQuiz: Quiz = {
      id: Date.now(),
      title: '',
      questions: []
    };
    this.selectedEditQuiz$.next(newQuiz);
  }


  public isQuizCorrect(q : Quiz) : void{
    if(q.questions.length == 0){
      throw new Error("Quiz lenght error");
    }
    q.questions.forEach(q => {

      if(q.question.length == 0){
        throw new Error("Question title incorrect");
      }
      let correctAnswerCount = 0;
      q.answers.forEach(a => {
        if(a.isCorrect){
          correctAnswerCount+=1;
        }
      })
      if(correctAnswerCount == 0){
        throw new Error("No correct answer in a question");
      }
    })
  }

  public selectQuizForEdition(quiz: Quiz): void {
    this.selectedEditQuiz$.next(quiz);
    console.log("Edit Quiz Pressed : " + quiz.id + ", " + quiz.title);
  }

  public deleteQuiz(quizId: number): void {
    try {
      this.http.delete(this.apiUrl + "/" + quizId).subscribe({
        next: () => {
          this.getQuizzes(); console.log(this.quizzes$)
        },
        error: (err) => console.error("SERVER ERROR - ", err)
      });
    } catch (err) { console.error("Error - ", err) }

  }

}
