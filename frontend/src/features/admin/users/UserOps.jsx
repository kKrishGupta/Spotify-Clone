import { ShieldCheck, UserRoundCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: "u1", name: "Anaya Rao", plan: "Neural Plus", risk: "Clean" },
  { id: "u2", name: "Kairo Drift", plan: "Artist Pro", risk: "Clean" },
  { id: "u3", name: "Glass Circuit", plan: "Artist Pro", risk: "Review" },
];

export function UserOps() {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
          <div className="rounded-md bg-white/10 p-2 text-pulse">
            <UserRoundCog className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.plan}</p>
          </div>
          <Badge className="ml-auto" variant={user.risk === "Clean" ? "green" : "amber"}>
            <ShieldCheck className="size-3" />
            {user.risk}
          </Badge>
        </div>
      ))}
    </div>
  );
}
