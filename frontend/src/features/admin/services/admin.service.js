import { analyticsSeries, moderationQueue, platformMetrics } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const adminService = {
  getDashboard: () =>
    simulateNetwork({
      metrics: platformMetrics,
      moderationQueue,
      series: analyticsSeries,
      incidents: [
        { id: "inc-1", title: "API latency p95", severity: "medium", value: "218ms" },
        { id: "inc-2", title: "Report burst", severity: "high", value: "7 flagged" },
        { id: "inc-3", title: "Encoder backlog", severity: "low", value: "14 jobs" },
      ],
    }),
  resolveModeration: (id, decision) => simulateNetwork({ id, decision, resolved: true }, 240),
};
