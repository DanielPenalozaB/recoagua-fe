
export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ChallengeStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum ChallengeType {
  EDUCATIONAL = 'educational',
  PRACTICAL = 'practical',
  COMMUNITY = 'community',
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  score: number;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  challengeType: ChallengeType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateChallengeDto {
  name: string;
  description: string;
  score: number;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  challengeType: ChallengeType;
}

export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {}

export interface ChallengeFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Multi-select filters
  difficulty?: string | string[];
  status?: string | string[];
  type?: string | string[];

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}