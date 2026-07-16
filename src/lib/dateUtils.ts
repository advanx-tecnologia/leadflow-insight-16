import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
  subYears,
  format,
  parseISO,
  differenceInDays,
  eachDayOfInterval,
  getHours,
  getDay,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type PeriodType = "today" | "last7days" | "thisMonth" | "last30days" | "thisYear" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodInfo {
  current: DateRange;
  previous: DateRange;
  label: string;
}

export function getPeriodDates(period: PeriodType, customRange?: DateRange): PeriodInfo {
  const now = new Date();
  let current: DateRange;
  let previous: DateRange;
  let label: string;

  switch (period) {
    case "today":
      current = { start: startOfDay(now), end: endOfDay(now) };
      previous = { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
      label = "Hoje";
      break;

    case "last7days":
      current = { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
      previous = { start: startOfDay(subDays(now, 13)), end: endOfDay(subDays(now, 7)) };
      label = "Últimos 7 dias";
      break;

    case "thisMonth": {
      const startCurrent = startOfMonth(now);
      current = { start: startCurrent, end: endOfDay(now) };
      // Janela equivalente do mês anterior (mesmo nº de dias decorridos)
      const daysElapsed = differenceInDays(endOfDay(now), startCurrent);
      const prevMonthStart = startOfMonth(subMonths(now, 1));
      previous = {
        start: prevMonthStart,
        end: endOfDay(subDays(new Date(prevMonthStart.getTime()), 0)),
      };
      // Ajusta o fim do período anterior para mesmo nº de dias decorridos
      const prevEnd = new Date(prevMonthStart);
      prevEnd.setDate(prevEnd.getDate() + daysElapsed);
      previous = { start: prevMonthStart, end: endOfDay(prevEnd) };
      label = "Este mês";
      break;
    }

    case "last30days":
      current = { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
      previous = { start: startOfDay(subDays(now, 59)), end: endOfDay(subDays(now, 30)) };
      label = "Últimos 30 dias";
      break;

    case "thisYear": {
      const startCurrent = startOfYear(now);
      current = { start: startCurrent, end: endOfDay(now) };
      // Janela equivalente do ano anterior (mesmo nº de dias decorridos)
      const daysElapsed = differenceInDays(endOfDay(now), startCurrent);
      const prevYearStart = startOfYear(subYears(now, 1));
      const prevEnd = new Date(prevYearStart);
      prevEnd.setDate(prevEnd.getDate() + daysElapsed);
      previous = { start: prevYearStart, end: endOfDay(prevEnd) };
      label = "Este ano";
      break;
    }

    case "custom":
      if (customRange) {
        current = { start: startOfDay(customRange.start), end: endOfDay(customRange.end) };
        const daysDiff = differenceInDays(current.end, current.start);
        previous = {
          start: startOfDay(subDays(current.start, daysDiff + 1)),
          end: endOfDay(subDays(current.start, 1)),
        };
        label = `${format(current.start, "dd/MM/yy")} - ${format(current.end, "dd/MM/yy")}`;
      } else {
        current = { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
        previous = { start: startOfDay(subDays(now, 13)), end: endOfDay(subDays(now, 7)) };
        label = "Últimos 7 dias";
      }
      break;

    default:
      current = { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
      previous = { start: startOfDay(subDays(now, 13)), end: endOfDay(subDays(now, 7)) };
      label = "Últimos 7 dias";
  }

  return { current, previous, label };
}

export function formatDate(date: Date | string, formatStr: string = "dd/MM/yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr, { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function getDaysInRange(range: DateRange): Date[] {
  return eachDayOfInterval({ start: range.start, end: range.end });
}

export function getHourFromDate(date: Date | string): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  return getHours(d);
}

export function getDayOfWeekFromDate(date: Date | string): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  return getDay(d);
}

export function isDateInRange(date: Date | string, range: DateRange): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isWithinInterval(d, { start: range.start, end: range.end });
}

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const WEEKDAY_LABELS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
