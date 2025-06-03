

export interface ProfileStatsBasic {
    quizCount: number;
    bestScore: number;
    averageScore: number;
    lastPlayedDate: string;
  }
  
  export const PROFILE_STATS_MOCK: Record<number, ProfileStatsBasic> = {
    1: {
      quizCount: 15,
      bestScore: 92,
      averageScore: 78,
      lastPlayedDate: '27/04/2025'
    },
    2: {
      quizCount: 8,
      bestScore: 85,
      averageScore: 70,
      lastPlayedDate: '22/04/2025'
    },
    3: {
      quizCount: 12,
      bestScore: 88,
      averageScore: 75,
      lastPlayedDate: '25/04/2025'
    },
    4: {
      quizCount: 6,
      bestScore: 78,
      averageScore: 62,
      lastPlayedDate: '18/04/2025'
    },
    5: {
      quizCount: 20,
      bestScore: 95,
      averageScore: 85,
      lastPlayedDate: '26/04/2025'
    }
  };