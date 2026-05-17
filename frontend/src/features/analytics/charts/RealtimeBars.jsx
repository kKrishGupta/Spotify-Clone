import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function RealtimeBars({ data }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(7,7,17,.92)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Bar dataKey="streams" fill="#00e5ff" radius={[6, 6, 0, 0]} />
          <Bar dataKey="saves" fill="#ff4ecd" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
