import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DailyVolume } from "@/hooks/useLeadsData";

interface LeadsLineChartProps {
  data: DailyVolume[];
  isLoading: boolean;
}

export function LeadsLineChart({ data, isLoading }: LeadsLineChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up">
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[300px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Volume de Leads por Dia</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
            <XAxis
              dataKey="dateFormatted"
              stroke="hsl(215, 20%, 78%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 78%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 13%)",
                border: "1px solid hsl(217, 33%, 25%)",
                borderRadius: "8px",
                color: "hsl(213, 31%, 91%)",
              }}
              labelStyle={{ color: "hsl(213, 31%, 91%)" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="previous"
              name="Período Anterior"
              stroke="hsl(215, 30%, 55%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="current"
              name="Período Atual"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCurrent)"
              dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "hsl(217, 91%, 60%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
