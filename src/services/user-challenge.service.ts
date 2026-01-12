import { ApiService } from "./api";
import { Badge } from "@/types/badge";
import { Level } from "@/types/level";
import { ApiResponse } from "@/types/common";

export interface ChallengeCompletionResult {
  id: number;
  completionStatus: string;
  xpAwarded: number;
  leveledUp: boolean;
  newLevel: Level | null;
  awardedBadges: Badge[];
}

export class UserChallengeService extends ApiService {
  /**
   * Completes a challenge for the current user
   */
  async completeChallenge(challengeId: number): Promise<ApiResponse<ChallengeCompletionResult>> {
    return this.post(`/user-challenges/${challengeId}/complete`, {});
  }
}

export const userChallengeService = new UserChallengeService();
