import { Module } from "./module";

export enum GuideStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Guide {
  id: number;
  name: string;
  description: string;
  estimatedDuration: number;
  status: GuideStatus;
  language: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
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