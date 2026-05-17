import { analyticsSeries, audienceSegments, platformMetrics } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const analyticsService = {
  getDashboard: () =>
    simulateNetwork({
      metrics: platformMetrics,
      series: analyticsSeries,
      audience: audienceSegments,
      heatmap: [
        ["00", 42, 28, 24, 38, 56, 88, 76],
        ["06", 62, 54, 48, 63, 88, 110, 94],
        ["12", 92, 84, 75, 96, 122, 150, 132],
        ["18", 120, 116, 102, 138, 172, 210, 188],
      ],
    }),
};
