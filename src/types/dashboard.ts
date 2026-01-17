export interface PopularGuide {
  id: number;
  name: string;
  userCount: number;
  completionPercentage: number;
}

export interface UsersByRegion {
  region: string;
  count: number;
}

export interface ChallengeProgress {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface UserAcquisition {
  date: string;
  count: number;
}

export interface UserEngagement {
  date: string;
  count: number;
}

export interface EducationalImpact {
  globalAccuracy: number,
  totalQuestionsAnswered: number
}

export interface DashboardStats {
  totalUsers: number;
  completedGuides: number;
  activeChallenges: number;
  participationPercentage: number;
  popularGuides: PopularGuide[];
  usersByRegion: UsersByRegion[];
  challengeProgress: ChallengeProgress;
  badgesGranted: number;
  userAcquisition: UserAcquisition[];
  userEngagement: UserEngagement[];
  educationalImpact: EducationalImpact;
}
