import { Region, RegionFilterDto, CreateRegionDto, UpdateRegionDto } from '@/types/region';
import { ApiResponse, PaginationResponse } from '@/types/common';
import { ApiService } from './api';

export class RegionService extends ApiService {
  async getRegions(filters?: RegionFilterDto): Promise<PaginationResponse<Region>> {
    const queryParams = new URLSearchParams();

    // String search parameters
    if (filters?.name) queryParams.append('search', filters.name);

    // Single value parameters
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    // Sorting parameters (if needed in the future)
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    return this.get(`/regions?${queryParams.toString()}`);
  }

  async getRegion(id: number): Promise<ApiResponse<Region>> {
    return this.get(`/regions/${id}`);
  }

  async createRegion(regionData: CreateRegionDto): Promise<Region> {
    return this.post('/regions', regionData);
  }

  async updateRegion(id: number, regionData: UpdateRegionDto): Promise<Region> {
    return this.patch(`/regions/${id}`, regionData);
  }

  async deleteRegion(id: number): Promise<void> {
    return this.delete(`/regions/${id}`);
  }
}

export const regionService = new RegionService();