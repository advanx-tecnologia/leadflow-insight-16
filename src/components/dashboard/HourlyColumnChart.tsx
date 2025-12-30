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
import { HourlyDistribution } from "@/hooks/useLeadsData";

interface HourlyColumnChartProps {
  data: HourlyDistribution[];
  isLoading: boolean;
}

export function HourlyColumnChart({ data, isLoading }: HourlyColumnChartProps) {
  const peakHour = data.find((d) => d.isPeak);

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[250px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Leads por Hora do Dia</h3>
        {peakHour && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Pico: {peakHour.label}
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
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={2}
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
                color: "hsl(213, 31%, 91%)",
              }}
              cursor={{ fill: "hsl(217, 33%, 17%)" }}
            />
            <Bar dataKey="count" name="Leads" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isPeak ? "hsl(217, 91%, 60%)" : "hsl(217, 91%, 60%, 0.5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
