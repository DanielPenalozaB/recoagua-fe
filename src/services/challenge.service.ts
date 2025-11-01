import type {
	Challenge,
	ChallengeFilterDto,
	CreateChallengeDto,
	UpdateChallengeDto,
} from "@/types/challenge";
import type { ApiResponse, PaginationResponse } from "@/types/common";
import { ApiService } from "./api";

export class ChallengeService extends ApiService {
	async getChallenges(
		filters?: ChallengeFilterDto,
	): Promise<PaginationResponse<Challenge>> {
		const queryParams = new URLSearchParams();

		this.handleArrayParameters(queryParams, "difficulty", filters?.difficulty);
		this.handleArrayParameters(queryParams, "status", filters?.status);
		this.handleArrayParameters(queryParams, "challengeType", filters?.type);

		this.handleStringSearchParameters(queryParams, filters?.name);

		this.handleSingleValueParameters(queryParams, "page", filters?.page);
		this.handleSingleValueParameters(queryParams, "limit", filters?.limit);

		this.handleSortingParameters(
			queryParams,
			filters?.sortBy,
			filters?.sortOrder,
		);

		return this.get(`/challenges?${queryParams.toString()}`);
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
	async getChallenge(id: number): Promise<ApiResponse<Challenge>> {
		return this.get(`/challenges/${id}`);
	}

	async createChallenge(challengeData: CreateChallengeDto): Promise<Challenge> {
		return this.post("/challenges", challengeData);
	}

	async updateChallenge(
		id: number,
		challengeData: UpdateChallengeDto,
	): Promise<Challenge> {
		return this.patch(`/challenges/${id}`, challengeData);
	}

	async deleteChallenge(id: number): Promise<void> {
		return this.delete(`/challenges/${id}`);
	}
}

export const challengeService = new ChallengeService();
