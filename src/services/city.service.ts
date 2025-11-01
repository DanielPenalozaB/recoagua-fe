import type {
	City,
	CityFilterDto,
	CreateCityDto,
	UpdateCityDto,
} from "@/types/city";
import type { ApiResponse, PaginationResponse } from "@/types/common";
import { ApiService } from "./api";

export class CityService extends ApiService {
	async getCities(filters?: CityFilterDto): Promise<PaginationResponse<City>> {
		const queryParams = new URLSearchParams();

		// String search parameters
		if (filters?.name) queryParams.append("search", filters.name);

		// Single value parameters
		if (filters?.regionId)
			queryParams.append("regionId", filters.regionId.toString());
		if (filters?.page) queryParams.append("page", filters.page.toString());
		if (filters?.limit) queryParams.append("limit", filters.limit.toString());

		// Sorting parameters (if needed in the future)
		if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
		if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

		return this.publicGet(`/cities?${queryParams.toString()}`);
	}

	async getCity(id: number): Promise<ApiResponse<City>> {
		return this.get(`/cities/${id}`);
	}

	async createCity(cityData: CreateCityDto): Promise<City> {
		return this.post("/cities", cityData);
	}

	async updateCity(id: number, cityData: UpdateCityDto): Promise<City> {
		return this.patch(`/cities/${id}`, cityData);
	}

	async deleteCity(id: number): Promise<void> {
		return this.delete(`/cities/${id}`);
	}
}

export const cityService = new CityService();
