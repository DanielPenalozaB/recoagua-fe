import { dashboardService } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getDashboardStats(),
  });
};
