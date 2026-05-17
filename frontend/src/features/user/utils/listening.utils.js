export function listeningIntensity(minutes, goal) {
  return Math.min(100, Math.round((minutes / goal) * 100));
}
