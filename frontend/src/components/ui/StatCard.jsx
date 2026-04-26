import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/helpers";

const StatCard = ({ label, value, delta, icon: Icon, tone = "purple" }) => {
  const isNegative = String(delta || "").startsWith("-");
  const toneClass = tone === "pink" ? "from-beatPink/35 to-beatPurple/10" : "from-beatPurple/35 to-beatPink/10";

  return (
    <div className="glass-soft group relative overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-70 blur-2xl", toneClass)} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-white/50">{label}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">{value}</h3>
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white/80 ring-1 ring-white/10">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>

      {delta ? (
        <div
          className={cn(
            "relative mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
            isNegative ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300",
          )}
        >
          {isNegative ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          {delta}
        </div>
      ) : null}
    </div>
  );
};

export default StatCard;
