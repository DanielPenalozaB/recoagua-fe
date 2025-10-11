import { ApiResponse, PaginationResponse } from '@/types/common';
import { ApiService } from './api';
import { Zone, ZoneFilterDto, CreateZoneDto, UpdateZoneDto } from '@/types/zone';

export class ZoneService extends ApiService {
  async getZones(filters?: ZoneFilterDto): Promise<PaginationResponse<Zone>> {
    const queryParams = new URLSearchParams();

    this.handleArrayParameters(queryParams, 'status', filters?.status);

    this.handleStringSearchParameters(queryParams, filters?.name);

    this.handleSingleValueParameters(queryParams, 'page', filters?.page);
    this.handleSingleValueParameters(queryParams, 'limit', filters?.limit);

    this.handleSortingParameters(queryParams, filters?.sortBy, filters?.sortOrder);

    return this.get(`/zones?${queryParams.toString()}`);
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
  async getZone(id: number): Promise<ApiResponse<Zone>> {
    return this.get(`/zones/${id}`);
  }

  async createZone(zoneData: CreateZoneDto): Promise<Zone> {
    return this.post('/zones', zoneData);
  }

  async updateZone(id: number, zoneData: UpdateZoneDto): Promise<Zone> {
    return this.patch(`/zones/${id}`, zoneData);
  }

  async deleteZone(id: number): Promise<void> {
    return this.delete(`/zones/${id}`);
  }
}

export const zoneService = new ZoneService();