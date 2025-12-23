import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SourceDistribution } from "@/hooks/useLeadsData";

interface SourceDistributionChartProps {
  data: SourceDistribution[];
  isLoading: boolean;
}

const COLORS = [
  "hsl(217, 91%, 60%)",   // Primary blue
  "hsl(142, 76%, 36%)",   // Success green
  "hsl(38, 92%, 50%)",    // Warning yellow
  "hsl(280, 87%, 65%)",   // Purple
  "hsl(0, 84%, 60%)",     // Red
  "hsl(180, 70%, 45%)",   // Teal
  "hsl(330, 80%, 60%)",   // Pink
  "hsl(60, 70%, 50%)",    // Lime
];

export function SourceDistributionChart({ data, isLoading }: SourceDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[300px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-glass-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.source}</p>
          <p className="text-sm text-muted-foreground">
            {data.count} leads ({data.percentage}%)
          </p>
          <p className="text-sm text-success">
            Taxa de conversão: {data.conversionRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <h3 className="text-lg font-semibold mb-6">Distribuição por Fonte</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="source"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry: any) => (
                <span className="text-sm text-foreground">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
