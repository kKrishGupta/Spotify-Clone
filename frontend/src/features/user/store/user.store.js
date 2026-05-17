import { create } from "zustand";

export const useUserStore = create((set) => ({
  selectedMood: "Electric focus",
  setSelectedMood: (selectedMood) => set({ selectedMood }),
  listeningGoal: 90,
  setListeningGoal: (listeningGoal) => set({ listeningGoal }),
}));
