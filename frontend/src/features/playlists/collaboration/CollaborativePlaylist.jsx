import { useState } from "react";
import { Send, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/common/GlassPanel";
import { playlistsService } from "@/features/playlists/services/playlists.service";

export function CollaborativePlaylist({ playlist }) {
  const [email, setEmail] = useState("producer@studio.ai");
  const [status, setStatus] = useState("");

  async function invite() {
    const result = await playlistsService.addCollaborator(playlist.id, email);
    setStatus(result.invited ? "Invite sent to collaborator room." : "");
  }

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-aurora/15 p-3 text-aurora">
          <UsersRound className="size-6" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Collaborative control</h2>
          <p className="text-sm text-muted-foreground">Invite editors into {playlist.name}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Input value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button onClick={invite} variant="neon">
          <Send className="size-4" />
          Invite
        </Button>
      </div>
      {status ? <p className="mt-3 text-sm text-pulse">{status}</p> : null}
    </GlassPanel>
  );
}
