import { ApiResponse } from "@/types/common";
import { ApiService } from "./api";

export interface SubmitResponseDto {
  blockId: number;
  selectedAnswerIds?: number[];
  customAnswer?: string;
  relationalPairId?: number;
  resourceViewed?: boolean;
}

export interface UserProgressUpdate {
  id: number;
  completionStatus: string;
  earnedPoints: number;
  completedAt: string | null;
}

export interface BlockSubmissionResult {
  id: number;
  blockId: number;
  isCorrect: boolean;
  earnedPoints: number;
  submittedAt: string;
  progress: UserProgressUpdate;
}

export class UserBlockResponseService extends ApiService {
  /**
   * Records a user's interaction with a block (answer, quiz, or content view)
   */
  async submitResponse(
    data: SubmitResponseDto
  ): Promise<ApiResponse<BlockSubmissionResult>> {
    return this.post("/user-block-responses", data);
  }

  /**
   * Gets statistics for a specific user
   */
  async getUserStats(userId: number) {
    return this.get(`/user-block-responses/user/${userId}/stats`);
  }

  /**
   * Gets the user's specific response for a single block
   */
  async getResponseByBlock(userId: number, blockId: number) {
    return this.get(`/user-block-responses/user/${userId}/block/${blockId}`);
  }
}

export const userBlockResponseService = new UserBlockResponseService();
