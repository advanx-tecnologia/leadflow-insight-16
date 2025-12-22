import { TrendingUp, TrendingDown, Users, CalendarDays, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadsMetrics } from "@/hooks/useLeadsData";

interface MetricsCardsProps {
  metrics: LeadsMetrics;
  isLoading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon: React.ReactNode;
  isLoading: boolean;
  delay?: number;
}

function MetricCard({ title, value, subtitle, change, icon, isLoading, delay = 0 }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className="glass-card-hover p-6 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            <div className="flex items-center gap-2">
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center text-xs font-medium",
                    isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total de Leads"
        value={metrics.totalLeads.toLocaleString("pt-BR")}
        change={metrics.percentageChange}
        subtitle="vs período anterior"
        icon={<Users className="h-5 w-5" />}
        isLoading={isLoading}
        delay={0}
      />
      <MetricCard
        title="Leads Hoje"
        value={metrics.leadsToday}
        icon={<CalendarDays className="h-5 w-5" />}
        isLoading={isLoading}
        delay={50}
      />
      <MetricCard
        title="Média Diária"
        value={metrics.averageDaily}
        subtitle="leads/dia"
        icon={<BarChart3 className="h-5 w-5" />}
        isLoading={isLoading}
        delay={100}
      />
      <MetricCard
        title="Pico Diário"
        value={metrics.peakDaily.count}
        subtitle={`em ${metrics.peakDaily.date}`}
        icon={<Zap className="h-5 w-5" />}
        isLoading={isLoading}
        delay={150}
      />
    </div>
  );
}
