import { ApiResponse, PaginationResponse } from '@/types/common';
import { ApiService } from './api';
import { CreateBadgeDto, Badge, BadgeFilterDto, UpdateBadgeDto } from '@/types/badge';

export class BadgeService extends ApiService {
  async getBadges(filters?: BadgeFilterDto): Promise<PaginationResponse<Badge>> {
    const queryParams = new URLSearchParams();

    this.handleArrayParameters(queryParams, 'status', filters?.status);
    this.handleStringSearchParameters(queryParams, filters?.name);

    this.handleSingleValueParameters(queryParams, 'page', filters?.page);
    this.handleSingleValueParameters(queryParams, 'limit', filters?.limit);

    this.handleSortingParameters(queryParams, filters?.sortBy, filters?.sortOrder);

    return this.get(`/badges?${queryParams.toString()}`);
  }

  handleArrayParameters(queryParams: URLSearchParams, key: string, values?: string | string[]) {
    if (values) {
      if (Array.isArray(values)) {
        values.forEach(value => queryParams.append(key, value));
      } else {
        queryParams.append(key, values);
      }
    }
  }

  handleStringSearchParameters(queryParams: URLSearchParams, value?: string) {
    if (value) {
      queryParams.append('search', value);
    }
  }

  handleSingleValueParameters(queryParams: URLSearchParams, key: string, value?: number | string) {
    if (value) {
      queryParams.append(key, value.toString());
    }
  }

  handleSortingParameters(queryParams: URLSearchParams, sortBy?: string, sortOrder?: 'asc' | 'desc') {
    if (sortBy) {
      queryParams.append('sortBy', sortBy);
    }
    if (sortOrder) {
      queryParams.append('sortOrder', sortOrder);
    }
  }
  async getBadge(id: number): Promise<ApiResponse<Badge>> {
    return this.get(`/badges/${id}`);
  }

  async createBadge(challengeData: CreateBadgeDto): Promise<Badge> {
    return this.post('/badges', challengeData);
  }

  async updateBadge(id: number, challengeData: UpdateBadgeDto): Promise<Badge> {
    return this.patch(`/badges/${id}`, challengeData);
  }

  async deleteBadge(id: number): Promise<void> {
    return this.delete(`/badges/${id}`);
  }
}

export const badgeService = new BadgeService();