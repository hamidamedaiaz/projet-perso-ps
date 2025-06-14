import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizResult } from '../models/quiz-result.model';
import { HttpClient } from '@angular/common/http';
import { QUIZ_RESULT_EMPTY } from 'src/mocks/quiz-results.mock';
import { ProfileService } from './profile.service';
import { firstValueFrom } from 'rxjs';
import { CurrentProfileService } from './currentProfile.service';

@Injectable({
  providedIn: 'root'
})

export class QuizResultService implements OnInit {

  private allResults: QuizResult[] = [];

  private apiUrl: string = "http://localhost:9428/api/quiz-results/"

  public results$: BehaviorSubject<QuizResult[]> = new BehaviorSubject<QuizResult[]>([]);

  constructor(
    private http: HttpClient, private profileService: ProfileService, private currentProfileService:CurrentProfileService) {
    this.requestResult();
  }

  ngOnInit(): void {
    this.requestResult();
  }

  public async requestResult(): Promise<void> {
    const quizResults = await firstValueFrom(this.http.get<QuizResult[]>(this.apiUrl));
    this.allResults = quizResults;
    this.results$.next(this.allResults);
  }


  getQuizResultsByProfile(profileId: number) {
    const quizResults = this.allResults.filter(
      (quizResult) => quizResult.profileId === profileId
    );
    return quizResults
  }

  getQuizResultsByQuiz(quizId: number) {
    const quizResults = this.allResults.filter((quizResult) => {
      return quizResult.quizId === quizId
    })
    return quizResults;
  }

  getQuizResult(quizResultId: number): QuizResult {
    const quizResult = this.allResults.find((result) => result.id === quizResultId);
    if (quizResult) return quizResult;
    return QUIZ_RESULT_EMPTY;
  }

  sendQuizResult(quizResult: QuizResult) {
    if (quizResult.sessionId !== "None" && this.currentProfileService.getCurrentProfile().role !== 'admin') {
      this.http.post(this.apiUrl, quizResult).subscribe({
        next: () => {
          this.requestResult();
        },
        error: (err) => {
          console.error(`Failed to create Quiz Result ${quizResult.id} - ${err}`);
        }
      })
    }
  }

  async deleteQuizResult(quizResultIndex: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(this.apiUrl + "/" + quizResultIndex));
      this.allResults = this.allResults.filter((result) => result.id !== quizResultIndex);
      await this.requestResult();
    } catch (error) {
      console.error("[SERVER ERROR] - ", error);
      throw error; // On propage l'erreur à l'appelant
    }
  }



  getProfilesInSession(sessionId: string) {
    const profileIds: number[] = []
    this.allResults.filter((quizResult) => {
      if (quizResult.sessionId === sessionId) profileIds.push(quizResult.profileId);
    })
    return this.profileService.getProfiles(profileIds);
  }

  public async getQuizResults(sessionId:string){
    await this.requestResult();
    return this.allResults.filter(result => result.sessionId === sessionId);
  }
}
