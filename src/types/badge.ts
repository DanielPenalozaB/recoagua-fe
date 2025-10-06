export enum BadgeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  requirements: string;
  status: BadgeStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateBadgeDto {
  name: string;
  description: string;
  imageUrl?: string;
  requirements: string;
  status: BadgeStatus;
}

export interface UpdateBadgeDto extends Partial<CreateBadgeDto> {}

export interface BadgeFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Multi-select filters
  status?: string | string[];

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}