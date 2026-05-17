import { feedEvents } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const feedService = {
  list: () => simulateNetwork(feedEvents),
};
