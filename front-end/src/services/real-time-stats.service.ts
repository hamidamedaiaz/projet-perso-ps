import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuestionStats} from 'src/models/QuestionStats'




@Injectable({
  providedIn: 'root'
})
export class RealTimeStatsService {
  
  private sessionStats = new Map<string, Map<number, QuestionStats>>();
  
  /// un Observable pour les stat de la session courante
  public currentSessionStats$ = new BehaviorSubject<Map<number, QuestionStats>>(new Map());
  
  private currentSessionId: string = '';

  constructor() {}

  
   /// on initialise une nauvelle session
   
  initSession(sessionId: string) {
    this.currentSessionId = sessionId;
    this.sessionStats.set(sessionId, new Map());
    this.currentSessionStats$.next(new Map());
  }

  ///   ici on  Ajoute une reeponse et recalcule les pourcentages

  addAnswer(sessionId: string, questionId: number, answerId: number) {
    if (!this.sessionStats.has(sessionId)) {
      this.sessionStats.set(sessionId, new Map());
    }

    const sessionMap = this.sessionStats.get(sessionId)!;
    
    if (!sessionMap.has(questionId)) {
      sessionMap.set(questionId, {
        questionId,
        totalAnswers: 0,
        answerCounts: new Map(),
        percentages: new Map()
      });
    }

    const questionStats = sessionMap.get(questionId)!;
    
    /// incremente le compteur pour cette reponse
    const currentCount = questionStats.answerCounts.get(answerId) || 0;
    questionStats.answerCounts.set(answerId, currentCount + 1);
    questionStats.totalAnswers++;

    /// recalcule les pourcentages
    this.recalculatePercentages(questionStats);

    /// notifie les changements si c'est la session courante
    if (sessionId === this.currentSessionId) {
      this.currentSessionStats$.next(sessionMap);
    }
  }


  
  private recalculatePercentages(questionStats: QuestionStats) {
    questionStats.percentages.clear();
    
    if (questionStats.totalAnswers === 0) return;

    questionStats.answerCounts.forEach((count, answerId) => {
      const percentage = Math.round((count / questionStats.totalAnswers) * 100);
      questionStats.percentages.set(answerId, percentage);
    });
  }


  getQuestionStats(questionId: number): QuestionStats | undefined {
    const sessionMap = this.sessionStats.get(this.currentSessionId);
    return sessionMap?.get(questionId);
  }



  clearSession(sessionId: string) {
    this.sessionStats.delete(sessionId);
    if (sessionId === this.currentSessionId) {
      this.currentSessionStats$.next(new Map());
    }
  }
}