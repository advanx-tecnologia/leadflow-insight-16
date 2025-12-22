import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { DailyVolume } from "@/hooks/useLeadsData";
import { useMemo } from "react";

interface PeaksTimelineProps {
  data: DailyVolume[];
  isLoading: boolean;
}

export function PeaksTimeline({ data, isLoading }: PeaksTimelineProps) {
  const peaks = useMemo(() => {
    if (data.length < 3) return [];
    
    const threshold = data.reduce((sum, d) => sum + d.current, 0) / data.length * 1.5;
    
    return data
      .map((d, index) => ({ ...d, index }))
      .filter((d) => d.current >= threshold)
      .slice(0, 5);
  }, [data]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[200px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Timeline de Picos</h3>
        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
          {peaks.length} picos identificados
        </span>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
            <XAxis
              dataKey="dateFormatted"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
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
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Leads"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              dot={false}
            />
            {peaks.map((peak) => (
              <ReferenceDot
                key={peak.index}
                x={peak.dateFormatted}
                y={peak.current}
                r={6}
                fill="hsl(38, 92%, 50%)"
                stroke="hsl(222, 47%, 13%)"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
