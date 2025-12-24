import { useLeadsData } from "@/hooks/useLeadsData";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { SourceFilter } from "@/components/dashboard/SourceFilter";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { LeadsLineChart } from "@/components/dashboard/LeadsLineChart";
import { HourlyColumnChart } from "@/components/dashboard/HourlyColumnChart";
import { WeekdayChart } from "@/components/dashboard/WeekdayChart";
import { SourceDistributionChart } from "@/components/dashboard/SourceDistributionChart";
import { SourceAnalysis } from "@/components/dashboard/SourceAnalysis";
import { PeaksTimeline } from "@/components/dashboard/PeaksTimeline";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    filteredLeads,
    metrics,
    dailyVolume,
    hourlyDistribution,
    weekdayDistribution,
    sourceDistribution,
    availableSources,
    period,
    customRange,
    periodInfo,
    setPeriod,
    setCustomRange,
    selectedSource,
    setSelectedSource,
    isLoading,
    refetch,
    updateLead,
  } = useLeadsData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Título e botão refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                    Dashboard de Leads
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Análise em tempo real • Atualização automática a cada 30s
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={refetch}
                disabled={isLoading}
                className="glass-card border-border/50 h-9 w-9 sm:h-10 sm:w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <PeriodSelector
                period={period}
                customRange={customRange}
                periodLabel={periodInfo.label}
                onPeriodChange={setPeriod}
                onCustomRangeChange={setCustomRange}
              />
              <SourceFilter
                sources={availableSources}
                selectedSource={selectedSource}
                onSourceChange={setSelectedSource}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* KPI Cards */}
        <MetricsCards metrics={metrics} isLoading={isLoading} />

        {/* Charts Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <LeadsLineChart data={dailyVolume} isLoading={isLoading} />
          <HourlyColumnChart data={hourlyDistribution} isLoading={isLoading} />
        </div>

        {/* Charts Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <WeekdayChart data={weekdayDistribution} isLoading={isLoading} />
          <SourceDistributionChart data={sourceDistribution} isLoading={isLoading} />
          <SourceAnalysis data={sourceDistribution} isLoading={isLoading} />
        </div>

        {/* Peaks Timeline */}
        <PeaksTimeline
          data={dailyVolume}
          isLoading={isLoading}
        />

        {/* Data Table */}
        <LeadsTable 
          leads={filteredLeads} 
          isLoading={isLoading} 
          onUpdateLead={updateLead}
        />
      </main>
    </div>
  );
};

export default Index;
