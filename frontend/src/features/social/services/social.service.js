import { simulateNetwork } from "@/services/mockData.service";

export const socialService = {
  getNetwork: () =>
    simulateNetwork({
      followers: [
        { id: "f1", name: "Aarav", affinity: 94, status: "listening" },
        { id: "f2", name: "Leena", affinity: 88, status: "collaborating" },
        { id: "f3", name: "Dev", affinity: 82, status: "discovering" },
      ],
      profiles: [
        { id: "p1", name: "Maya Flux", role: "Artist", reach: "1.2M" },
        { id: "p2", name: "Kairo Drift", role: "Artist", reach: "2.8M" },
      ],
    }),
};
