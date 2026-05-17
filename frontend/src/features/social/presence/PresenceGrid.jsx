import { useAppStore } from "@/stores/app.store";

export function PresenceGrid() {
  const onlineUsers = useAppStore((state) => state.onlineUsers);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {onlineUsers.map((user) => (
        <div key={user.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <span className={`size-3 rounded-full ${user.color}`} />
            <div>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
