import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase, DadosCliente } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lead } from "@/lib/mockData";
import {
  PeriodType,
  DateRange,
  PeriodInfo,
  getPeriodDates,
  isDateInRange,
  getDaysInRange,
  getHourFromDate,
  getDayOfWeekFromDate,
  calculatePercentageChange,
  formatDate,
  WEEKDAY_LABELS,
} from "@/lib/dateUtils";

export interface LeadsMetrics {
  totalLeads: number;
  leadsToday: number;
  averageDaily: number;
  peakDaily: { count: number; date: string };
  previousTotalLeads: number;
  percentageChange: number;
}

export interface DailyVolume {
  date: string;
  dateFormatted: string;
  current: number;
  previous: number;
}

export interface HourlyDistribution {
  hour: number;
  label: string;
  count: number;
  isPeak: boolean;
}

export interface WeekdayDistribution {
  day: number;
  label: string;
  average: number;
  isPeak: boolean;
}

export interface SourceDistribution {
  source: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface UseLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  metrics: LeadsMetrics;
  dailyVolume: DailyVolume[];
  hourlyDistribution: HourlyDistribution[];
  weekdayDistribution: WeekdayDistribution[];
  sourceDistribution: SourceDistribution[];
  period: PeriodType;
  customRange: DateRange | undefined;
  periodInfo: PeriodInfo;
  setPeriod: (period: PeriodType) => void;
  setCustomRange: (range: DateRange) => void;
  isLoading: boolean;
  refetch: () => void;
}

// Converter DadosCliente para Lead
function convertToLead(data: DadosCliente): Lead {
  return {
    id: String(data.id),
    nome: String(data.nome ?? ""),
    telefone: String(data.telefone ?? ""),
    email: data.email ? String(data.email) : "",

    // Fonte vem da coluna "fonte" (preferencial) ou "fonte_conversa" (fallback)
    fonte_conversa: String((data.fonte ?? data.fonte_conversa ?? "")),

    status: String(data.status ?? ""),
    cidade: data.cidade ? String(data.cidade) : "",
    estado: data.estado ? String(data.estado) : "",
    created_at: String(data.created_at),
  };
}

export function useLeadsData(): UseLeadsDataReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [period, setPeriod] = useState<PeriodType>("last30days");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const periodInfo = useMemo(() => getPeriodDates(period, customRange), [period, customRange]);

  // Fetch data from Supabase
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dados_cliente")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar dados:", error);
        setLeads([]);
        toast({
          title: "Falha ao carregar leads",
          description: "Não foi possível ler dados_cliente. Verifique permissões (RLS) e nome das colunas.",
          variant: "destructive",
        });
        return;
      }

      // IMPORTANTE: não usamos mais dados mock como fallback,
      // para garantir que os números sempre reflitam o banco.
      if (!data) {
        setLeads([]);
        return;
      }

      if (data.length === 0) {
        setLeads([]);
        toast({
          title: "Nenhum lead retornado",
          description:
            "A consulta retornou 0 linhas. Se sua tabela tem ~130 linhas, isso normalmente é permissão/visibilidade (RLS) bloqueando o anon key.",
        });
        return;
      }

      setLeads(data.map(convertToLead));
    } catch (err) {
      console.error("Erro de conexão:", err);
      setLeads([]);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao banco para buscar os leads.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => isDateInRange(lead.created_at, periodInfo.current));
  }, [leads, periodInfo.current]);

  const previousLeads = useMemo(() => {
    return leads.filter((lead) => isDateInRange(lead.created_at, periodInfo.previous));
  }, [leads, periodInfo.previous]);

  const metrics = useMemo((): LeadsMetrics => {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    const leadsToday = leads.filter((lead) =>
      isDateInRange(lead.created_at, { start: todayStart, end: todayEnd })
    ).length;

    const days = getDaysInRange(periodInfo.current);
    const dailyCounts = days.map((day) => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      return filteredLeads.filter((lead) =>
        isDateInRange(lead.created_at, { start: dayStart, end: dayEnd })
      ).length;
    });

    const maxDaily = Math.max(...dailyCounts, 0);
    const maxDayIndex = dailyCounts.indexOf(maxDaily);
    const peakDate = days[maxDayIndex] || new Date();

    const averageDaily = dailyCounts.length > 0
      ? Math.round(dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length)
      : 0;

    return {
      totalLeads: filteredLeads.length,
      leadsToday,
      averageDaily,
      peakDaily: {
        count: maxDaily,
        date: formatDate(peakDate, "dd/MM"),
      },
      previousTotalLeads: previousLeads.length,
      percentageChange: calculatePercentageChange(filteredLeads.length, previousLeads.length),
    };
  }, [filteredLeads, previousLeads, leads, periodInfo.current]);

  const dailyVolume = useMemo((): DailyVolume[] => {
    const currentDays = getDaysInRange(periodInfo.current);
    const previousDays = getDaysInRange(periodInfo.previous);

    return currentDays.map((day, index) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const currentCount = filteredLeads.filter((lead) =>
        isDateInRange(lead.created_at, { start: dayStart, end: dayEnd })
      ).length;

      let previousCount = 0;
      if (previousDays[index]) {
        const prevDayStart = new Date(previousDays[index]);
        prevDayStart.setHours(0, 0, 0, 0);
        const prevDayEnd = new Date(previousDays[index]);
        prevDayEnd.setHours(23, 59, 59, 999);
        previousCount = previousLeads.filter((lead) =>
          isDateInRange(lead.created_at, { start: prevDayStart, end: prevDayEnd })
        ).length;
      }

      return {
        date: day.toISOString(),
        dateFormatted: formatDate(day, "dd/MM"),
        current: currentCount,
        previous: previousCount,
      };
    });
  }, [filteredLeads, previousLeads, periodInfo]);

  const hourlyDistribution = useMemo((): HourlyDistribution[] => {
    const hourlyCounts = Array(24).fill(0);
    filteredLeads.forEach((lead) => {
      const hour = getHourFromDate(lead.created_at);
      hourlyCounts[hour]++;
    });

    const maxCount = Math.max(...hourlyCounts);

    return hourlyCounts.map((count, hour) => ({
      hour,
      label: `${hour.toString().padStart(2, "0")}h`,
      count,
      isPeak: count === maxCount && maxCount > 0,
    }));
  }, [filteredLeads]);

  const weekdayDistribution = useMemo((): WeekdayDistribution[] => {
    const weekdayCounts = Array(7).fill(0);
    const weekdayDays = Array(7).fill(0);

    const days = getDaysInRange(periodInfo.current);
    days.forEach((day) => {
      const dayOfWeek = getDayOfWeekFromDate(day);
      weekdayDays[dayOfWeek]++;
    });

    filteredLeads.forEach((lead) => {
      const dayOfWeek = getDayOfWeekFromDate(lead.created_at);
      weekdayCounts[dayOfWeek]++;
    });

    const averages = weekdayCounts.map((count, index) =>
      weekdayDays[index] > 0 ? Math.round(count / weekdayDays[index]) : 0
    );

    const maxAverage = Math.max(...averages);

    return averages.map((average, day) => ({
      day,
      label: WEEKDAY_LABELS[day],
      average,
      isPeak: average === maxAverage && maxAverage > 0,
    }));
  }, [filteredLeads, periodInfo.current]);

  const sourceDistribution = useMemo((): SourceDistribution[] => {
    const sourceMap = new Map<string, { total: number; converted: number }>();

    filteredLeads.forEach((lead) => {
      const current = sourceMap.get(lead.fonte_conversa) || { total: 0, converted: 0 };
      current.total++;
      if (lead.status === "Convertido") current.converted++;
      sourceMap.set(lead.fonte_conversa, current);
    });

    const totalLeads = filteredLeads.length;

    return Array.from(sourceMap.entries())
      .map(([source, data]) => ({
        source,
        count: data.total,
        percentage: totalLeads > 0 ? Math.round((data.total / totalLeads) * 100) : 0,
        conversionRate: data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredLeads]);

  return {
    leads,
    filteredLeads,
    metrics,
    dailyVolume,
    hourlyDistribution,
    weekdayDistribution,
    sourceDistribution,
    period,
    customRange,
    periodInfo,
    setPeriod,
    setCustomRange,
    isLoading,
    refetch: fetchLeads,
  };
}
