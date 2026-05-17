import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { theme } from "@/config/theme";

export function MetricAreaChart({ data, primaryKey = "streams", secondaryKey = "saves", height = 320 }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="streamsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.chartColors[0]} stopOpacity={0.42} />
              <stop offset="95%" stopColor={theme.chartColors[0]} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="savesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.chartColors[1]} stopOpacity={0.34} />
              <stop offset="95%" stopColor={theme.chartColors[1]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(7,7,17,.92)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey={primaryKey}
            stroke={theme.chartColors[0]}
            strokeWidth={3}
            fill="url(#streamsGradient)"
          />
          <Area
            type="monotone"
            dataKey={secondaryKey}
            stroke={theme.chartColors[1]}
            strokeWidth={3}
            fill="url(#savesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
