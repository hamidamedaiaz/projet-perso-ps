import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./localstorage.service";
import { EMPTY_QUIZ } from "src/mocks/quiz.mock";
import { QuizResult } from "src/models/quiz-result.model";
import { QUIZ_RESULT_EMPTY } from "src/mocks/quiz-results.mock";
import { Quiz } from "src/models/quiz.model";
import { QuizResultService } from "./quiz-result.service";

@Injectable({
  providedIn: 'root'
})

export class StatsService {

  public profileId$ = new BehaviorSubject<number>(-1);
  public quizResultId$ = new BehaviorSubject<number>(-1);
  public quizId$ = new BehaviorSubject<number>(-1);

  private PROFILE_ID_KEY: string = "PROFILE_ID_KEY";
  private QUIZ_SESSION_ID_KEY: string = "QUIZ_SESSION_ID_KEY";
  private QUIZ_ID_KEY: string = "QUIZ_ID_KEY";

  constructor(private localStorageService: LocalStorageService, private quizResultService: QuizResultService) { this.loadFromStorage(); }

  public selectProfile(id: number) {
    this.profileId$.next(id);
    this.storeIntoStorage(this.PROFILE_ID_KEY, JSON.stringify(id));
  }

  public selectQuizResult(id: number) {
    this.quizResultId$.next(id);
    this.storeIntoStorage(this.QUIZ_SESSION_ID_KEY, JSON.stringify(id));
  }

  public selectQuiz(id: number) {
    this.quizId$.next(id);
    this.storeIntoStorage(this.QUIZ_ID_KEY, JSON.stringify(id));
  }

  private storeIntoStorage(key: string, content: string) {
    this.localStorageService.removeItem(key);
    this.localStorageService.storeItem(key, content);
  }

  private loadFromStorage(): void {
    const savedProfileId = this.localStorageService.getItem(this.PROFILE_ID_KEY);
    const savedQuizSessionId = this.localStorageService.getItem(this.QUIZ_SESSION_ID_KEY);
    const savedQuizId = this.localStorageService.getItem(this.QUIZ_ID_KEY);

    if (savedProfileId) this.profileId$.next(JSON.parse(savedProfileId));
    if (savedQuizSessionId) this.quizResultId$.next(JSON.parse(savedQuizSessionId));
    if (savedQuizId) this.quizId$.next(JSON.parse(savedQuizId));
  }

  async deleteQuizResult(): Promise<void> {
    try {
      await this.quizResultService.deleteQuizResult(this.quizResultId$.getValue());
      this.quizResultId$.next(-1);
    } catch (error) {
      // On laisse la gestion à l'appelant
      throw error;
    }
  }


}
