import { notifications } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

export const notificationsService = {
  list: () => simulateNetwork(notifications),
};
