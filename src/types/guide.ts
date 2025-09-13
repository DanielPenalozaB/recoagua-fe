import { Module } from "./module";

export enum GuideStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum GuideDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface Guide {
  id: number;
  name: string;
  description: string;
  difficulty: GuideDifficulty;
  estimatedDuration: number;
  status: GuideStatus;
  language: string;
  totalPoints: number;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuideDto {
  name: string;
  description: string;
  estimatedDuration: number;
  language: string;
  status?: GuideStatus;
}

export interface UpdateGuideDto extends Partial<CreateGuideDto> {
  id: number;
}

export interface GuideFilterDto {
  search?: string;
  status?: GuideStatus;
  language?: string;
  page?: number;
  limit?: number;
}

export interface GuideProgress {
  guideId: number;
  userId: number;
  completed: boolean;
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface GuideStats {
  guideId: number;
  totalViews: number;
  totalCompletions: number;
  averageCompletionTime: number;
  userEngagement: number;
}