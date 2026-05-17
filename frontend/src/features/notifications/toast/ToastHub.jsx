import { useAppStore } from "@/stores/app.store";

export function ToastHub() {
  const notifications = useAppStore((state) => state.notifications);

  return (
    <div className="fixed right-4 top-20 z-50 hidden w-80 space-y-2 xl:block">
      {notifications.slice(0, 2).map((notification) => (
        <div key={notification.id} className="glass rounded-lg p-4">
          <p className="font-semibold text-white">{notification.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
        </div>
      ))}
    </div>
  );
}
