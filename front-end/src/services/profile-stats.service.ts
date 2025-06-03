import { Injectable } from '@angular/core';
import { PROFILE_STATS_MOCK, ProfileStatsBasic } from 'src/mocks/profile-stats.mock';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileStatsService {
  private profileStatsCache = new Map<number, ProfileStatsBasic>();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeCache();
  }

 

  getProfileStats(profileId: number): ProfileStatsBasic {
    if (this.profileStatsCache.has(profileId)) {
      return this.profileStatsCache.get(profileId)!;
    }

    const defaultStats: ProfileStatsBasic = {
      quizCount: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayedDate: 'Jamais'
    };

    this.profileStatsCache.set(profileId, defaultStats);
    return defaultStats;
  }

  
  

  private initializeCache(): void {
    Object.entries(PROFILE_STATS_MOCK).forEach(([id, stats]) => {
      this.profileStatsCache.set(Number(id), { ...stats });
    });
  }

 

  clearCache(profileId?: number): void {
    if (profileId !== undefined) {
      this.profileStatsCache.delete(profileId);
    } else {
      this.profileStatsCache.clear();
      this.initializeCache();
    }
  }
}
