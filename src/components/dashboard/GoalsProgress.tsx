import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalRowProps {
  title: string;
  current: number;
  meta: number;
}

function GoalRow({ title, current, meta }: GoalRowProps) {
  const pct = meta > 0 ? Math.min(100, Math.round((current / meta) * 100)) : 0;
  const atingiu = meta > 0 && current >= meta;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{title}</span>
        <span className={atingiu ? "font-bold text-success" : "font-semibold text-foreground"}>
          {current} / {meta > 0 ? meta : "—"}
          {meta > 0 && <span className="ml-2 text-xs text-muted-foreground">{pct}%</span>}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

interface GoalsProgressProps {
  mesLabel: string;
  leadsDoMes: number;
  contratosDoMes: number;
  metaLeads: number;
  metaContratos: number;
  isLoading: boolean;
}

export function GoalsProgress({
  mesLabel,
  leadsDoMes,
  contratosDoMes,
  metaLeads,
  metaContratos,
  isLoading,
}: GoalsProgressProps) {
  if (isLoading) {
    return <div className="glass-card p-4 sm:p-6 h-28 animate-pulse" />;
  }

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <Target className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold capitalize">Metas de {mesLabel}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <GoalRow title="Leads" current={leadsDoMes} meta={metaLeads} />
        <GoalRow title="Contratos fechados" current={contratosDoMes} meta={metaContratos} />
      </div>
    </div>
  );
}
