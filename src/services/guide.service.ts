import { ApiResponse, PaginationResponse } from '@/types/common';
import { ApiService } from './api';
import { Guide, CreateGuideDto, UpdateGuideDto, GuideFilterDto, GuideProgress, GuideStats } from '@/types/guide';

export class GuideService extends ApiService {
  async getGuides(filters?: GuideFilterDto): Promise<PaginationResponse<Guide>> {
    const queryParams = new URLSearchParams();

    if (filters?.name) queryParams.append('name', filters.name);

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => queryParams.append('status', status));
      } else {
        queryParams.append('status', filters.status);
      }
    }

    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    return this.get(`/guides?${queryParams.toString()}`);
  }

  async getGuide(id: number): Promise<ApiResponse<Guide>> {
    return this.get(`/guides/${id}`);
  }

  async createGuide(guideData: CreateGuideDto): Promise<Guide> {
    return this.post('/guides', guideData);
  }

  async updateGuide(id: number, guideData: UpdateGuideDto): Promise<Guide> {
    return this.patch(`/guides/${id}`, guideData);
  }

  async deleteGuide(id: number): Promise<void> {
    return this.delete(`/guides/${id}`);
  }

  async publishGuide(id: number): Promise<Guide> {
    return this.patch(`/guides/${id}/publish`, {});
  }

  async getGuideProgress(guideId: number, userId: number): Promise<GuideProgress> {
    return this.get(`/guides/${guideId}/progress/${userId}`);
  }

  async getGuideStats(guideId: number): Promise<GuideStats> {
    return this.get(`/guides/${guideId}/stats`);
  }
}

export const guideService = new GuideService();