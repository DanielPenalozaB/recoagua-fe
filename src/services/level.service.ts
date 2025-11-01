import type { ApiResponse, PaginationResponse } from "@/types/common";
import type {
	CreateLevelDto,
	Level,
	LevelFilterDto,
	UpdateLevelDto,
} from "@/types/level";
import { ApiService } from "./api";

export class LevelService extends ApiService {
	async getLevels(
		filters?: LevelFilterDto,
	): Promise<PaginationResponse<Level>> {
		const queryParams = new URLSearchParams();

		this.handleStringSearchParameters(queryParams, filters?.name);

		this.handleSingleValueParameters(queryParams, "page", filters?.page);
		this.handleSingleValueParameters(queryParams, "limit", filters?.limit);

		this.handleSortingParameters(
			queryParams,
			filters?.sortBy,
			filters?.sortOrder,
		);

		return this.get(`/levels?${queryParams.toString()}`);
	}

	handleArrayParameters(
		queryParams: URLSearchParams,
		key: string,
		values?: string | string[],
	) {
		if (values) {
			if (Array.isArray(values)) {
				for (const value of values) {
					queryParams.append(key, value);
				}
			} else {
				queryParams.append(key, values);
			}
		}
	}

	handleStringSearchParameters(queryParams: URLSearchParams, value?: string) {
		if (value) {
			queryParams.append("search", value);
		}
	}

	handleSingleValueParameters(
		queryParams: URLSearchParams,
		key: string,
		value?: number | string,
	) {
		if (value) {
			queryParams.append(key, value.toString());
		}
	}

	handleSortingParameters(
		queryParams: URLSearchParams,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
	) {
		if (sortBy) {
			queryParams.append("sortBy", sortBy);
		}
		if (sortOrder) {
			queryParams.append("sortOrder", sortOrder);
		}
	}
	async getLevel(id: number): Promise<ApiResponse<Level>> {
		return this.get(`/levels/${id}`);
	}

	async createLevel(challengeData: CreateLevelDto): Promise<Level> {
		return this.post("/levels", challengeData);
	}

	async updateLevel(id: number, challengeData: UpdateLevelDto): Promise<Level> {
		return this.patch(`/levels/${id}`, challengeData);
	}

	async deleteLevel(id: number): Promise<void> {
		return this.delete(`/levels/${id}`);
	}
}

export const levelService = new LevelService();
