import { ActivityCard } from "@/features/feed/activity/ActivityCard";
import { useAppStore } from "@/stores/app.store";

export function ActivityTicker() {
  const activity = useAppStore((state) => state.activity);

  return (
    <div className="space-y-2">
      {activity.slice(0, 6).map((event) => (
        <ActivityCard key={event.id} event={event} />
      ))}
    </div>
  );
}
