import type { ApiResponse, PaginationResponse } from "@/types/common";
import type {
  CreateGuideDto,
  Guide,
  GuideFilterDto,
  GuideStats,
  ModuleProgress,
  UpdateGuideDto,
} from "@/types/guide";
import { ApiService } from "./api";

export class GuideService extends ApiService {
  async getGuides(
    filters?: GuideFilterDto
  ): Promise<PaginationResponse<Guide>> {
    const queryParams = new URLSearchParams();

    if (filters?.name) queryParams.append("search", filters.name);

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        for (const status of filters?.status ?? []) {
          queryParams.append("status", status.toLowerCase());
        }
      } else {
        queryParams.append("status", filters.status.toLowerCase());
      }
    }

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.hideCompleted)
      queryParams.append("hideCompleted", filters.hideCompleted.toString());

    return this.get(`/guides?${queryParams.toString()}`);
  }

  async getGuide(id: number): Promise<ApiResponse<Guide>> {
    return this.get(`/guides/${id}`);
  }

  async createGuide(guideData: CreateGuideDto): Promise<Guide> {
    return this.post("/guides", guideData);
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

  async getGuideProgress(
    guideId: number,
    userId: number
  ): Promise<ApiResponse<ModuleProgress[]>> {
    return this.get(`/guides/${guideId}/progress/${userId}`);
  }

  async getGuideStats(guideId: number): Promise<GuideStats> {
    return this.get(`/guides/${guideId}/stats`);
  }
}

export const guideService = new GuideService();
