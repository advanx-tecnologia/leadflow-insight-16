import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WeekdayDistribution } from "@/hooks/useLeadsData";

interface WeekdayChartProps {
  data: WeekdayDistribution[];
  isLoading: boolean;
}

export function WeekdayChart({ data, isLoading }: WeekdayChartProps) {
  const peakDay = data.find((d) => d.isPeak);

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[250px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Leads por Dia da Semana</h3>
        {peakDay && (
          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
            Melhor dia: {peakDay.label}
          </span>
        )}
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="hsl(215, 20%, 78%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(215, 20%, 78%)" }}
            />
            <YAxis
              stroke="hsl(215, 20%, 78%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(215, 20%, 78%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 13%)",
                border: "1px solid hsl(217, 33%, 25%)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "hsl(213, 31%, 91%)" }}
              labelStyle={{ color: "hsl(213, 31%, 91%)" }}
              formatter={(value: number) => [`${value} leads/dia`, "Média"]}
              cursor={{ fill: "hsl(217, 33%, 17%)" }}
            />
            <Bar dataKey="average" name="Média" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isPeak ? "hsl(142, 76%, 36%)" : "hsl(142, 76%, 36%, 0.5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
