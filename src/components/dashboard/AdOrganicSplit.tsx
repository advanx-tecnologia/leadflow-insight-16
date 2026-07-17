import { Megaphone, Sprout } from "lucide-react";
import { LeadsMetrics } from "@/hooks/useLeadsData";

interface Props {
  metrics: LeadsMetrics;
  isLoading: boolean;
}

// Métrica diferenciada: leads vindos de anúncio (creativo_url presente) vs orgânicos.
export function AdOrganicSplit({ metrics, isLoading }: Props) {
  const cards = [
    {
      title: "Anúncio (Meta Ads)",
      icon: <Megaphone className="h-5 w-5" />,
      leads: metrics.leadsAd,
      contratos: metrics.contratosAd,
      taxa: metrics.taxaConversaoAd,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Orgânico",
      icon: <Sprout className="h-5 w-5" />,
      leads: metrics.leadsOrganic,
      contratos: metrics.contratosOrganic,
      taxa: metrics.taxaConversaoOrganic,
      accent: "bg-success/10 text-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={c.title}
          className="glass-card-hover p-4 sm:p-6 animate-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {isLoading ? (
            <div className="h-20 bg-muted rounded animate-pulse" />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{c.title}</span>
                <div className={`p-2 rounded-lg ${c.accent}`}>{c.icon}</div>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {c.leads.toLocaleString("pt-BR")}
                  </h3>
                  <span className="text-xs text-muted-foreground">leads</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{c.contratos} contratos</p>
                  <p className="text-muted-foreground">{c.taxa}% conversão</p>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
