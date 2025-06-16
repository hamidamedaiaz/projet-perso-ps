import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuestionStats} from 'src/models/QuestionStats'
import { LocalStorageService } from './localstorage.service';

@Injectable({ providedIn: 'root' })

export class RealTimeStatsService {
  
  private sessionStats = new Map<string, Map<number, QuestionStats>>();
  
  /// un Observable pour les stat de la session courante
  public currentSessionStats$ = new BehaviorSubject<Map<number, QuestionStats>>(new Map());
  
  private currentSessionId: string = '';
  private readonly SESSION_STATS_KEY = 'REAL_TIME_SESSION_STATS';
  private readonly CURRENT_SESSION_KEY = 'CURRENT_SESSION_ID';


  constructor(private localStorageService: LocalStorageService) { this.loadFromStorage(); }

  
   /// on initialise une nauvelle session
   
  initSession(sessionId: string) {
    this.currentSessionId = sessionId;
    this.sessionStats.set(sessionId, new Map());
    this.currentSessionStats$.next(new Map());
    this.saveToStorage();
  }

  ///   ici on  Ajoute une reeponse et recalcule les pourcentages

  addAnswer(sessionId: string, questionId: number, answerId: number) {
    if (!this.sessionStats.has(sessionId)) this.sessionStats.set(sessionId, new Map()); 

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

    this.saveToStorage();
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
    if (sessionId === this.currentSessionId) this.currentSessionStats$.next(new Map()); 
    this.saveToStorage();
  }

 private loadFromStorage(): void {
  const savedStats = this.localStorageService.getItem(this.SESSION_STATS_KEY);
  const savedCurrentSession = this.localStorageService.getItem(this.CURRENT_SESSION_KEY);
  
  if (savedStats) {
    // reconstitue les Maps depuis l'objet JSON
    Object.entries(savedStats).forEach(([sessionId, questionStatsObj]) => {
      const questionStatsMap = new Map<number, QuestionStats>();

      Object.entries(questionStatsObj as any).forEach(([questionId, stats]: [string, any]) => {
        questionStatsMap.set(parseInt(questionId), {

          questionId: stats.questionId,
          totalAnswers: stats.totalAnswers,

          answerCounts: new Map(Object.entries(stats.answerCounts).map(([k, v]) => [parseInt(k), v as number])),
          percentages: new Map(Object.entries(stats.percentages).map(([k, v]) => [parseInt(k), v as number]))

        });
      });
      this.sessionStats.set(sessionId, questionStatsMap);
    });
  }
  
  if (savedCurrentSession) {
    this.currentSessionId = savedCurrentSession;
    const currentStats = this.sessionStats.get(this.currentSessionId) || new Map();
    this.currentSessionStats$.next(currentStats);
  }
}

  private saveToStorage(): void {

  // convertir les Maps en objets JSON
  const statsObj: any = {};
  this.sessionStats.forEach((questionStatsMap, sessionId) => {
    const questionStatsObj: any = {};
    questionStatsMap.forEach((stats, questionId) => {

      questionStatsObj[questionId] = {

        questionId: stats.questionId,
        totalAnswers: stats.totalAnswers,

        answerCounts: Object.fromEntries(stats.answerCounts),
        percentages: Object.fromEntries(stats.percentages)
      };
        });

    statsObj[sessionId] = questionStatsObj;
  });
  
  this.localStorageService.storeItem(this.SESSION_STATS_KEY, JSON.stringify(statsObj));
  this.localStorageService.storeItem(this.CURRENT_SESSION_KEY, JSON.stringify(this.currentSessionId));
}
}