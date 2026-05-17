import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { theme } from "@/config/theme";

export function DonutChart({ data, height = 260 }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={theme.chartColors[index % theme.chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(7,7,17,.92)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
