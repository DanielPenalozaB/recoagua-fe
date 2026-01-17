import type { ApiResponse } from "@/types/common";
import type { DashboardStats } from "@/types/dashboard";
import { ApiService } from "./api";

export class DashboardService extends ApiService {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get("/dashboard");
  }
}

export const dashboardService = new DashboardService();
