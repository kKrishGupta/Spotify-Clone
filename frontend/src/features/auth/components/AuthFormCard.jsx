import { Link } from "react-router-dom";
import { AudioLines } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthFormCard({ title, description, footer, children }) {
  return (
    <Card className="w-full max-w-md rounded-lg border-white/12 bg-black/30">
      <CardHeader>
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <div className="rounded-md bg-premium-line p-2 text-night">
            <AudioLines className="size-5" />
          </div>
          <Link to="/app/home" className="font-display text-lg font-semibold text-white">
            BeatFlow AI
          </Link>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
