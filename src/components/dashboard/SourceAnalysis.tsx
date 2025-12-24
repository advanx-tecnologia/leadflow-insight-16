import { SourceDistribution } from "@/hooks/useLeadsData";
import { TrendingUp } from "lucide-react";

interface SourceAnalysisProps {
  data: SourceDistribution[];
  isLoading: boolean;
}

export function SourceAnalysis({ data, isLoading }: SourceAnalysisProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Análise de Fontes</h3>
        <span className="text-xs text-muted-foreground">
          {data.length} fontes ativas
        </span>
      </div>
      <div className="space-y-4">
        {data.map((source, index) => {
          const barWidth = (source.count / maxCount) * 100;
          return (
            <div key={source.source || "(Sem fonte)"} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{source.source || "(Sem fonte)"}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {source.count} ({source.percentage}%)
                  </span>
                  <span className="flex items-center text-success text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {source.conversionRate}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: `hsl(217, 91%, ${60 - index * 5}%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
