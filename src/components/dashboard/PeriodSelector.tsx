import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PeriodType, DateRange } from "@/lib/dateUtils";
import { ptBR } from "date-fns/locale";

interface PeriodSelectorProps {
  period: PeriodType;
  customRange: DateRange | undefined;
  periodLabel: string;
  onPeriodChange: (period: PeriodType) => void;
  onCustomRangeChange: (range: DateRange) => void;
}

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "last7days", label: "Últimos 7 dias" },
  { value: "thisMonth", label: "Este mês" },
  { value: "last30days", label: "Últimos 30 dias" },
  { value: "thisYear", label: "Este ano" },
  { value: "custom", label: "Personalizado" },
];

export function PeriodSelector({
  period,
  customRange,
  periodLabel,
  onPeriodChange,
  onCustomRangeChange,
}: PeriodSelectorProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: customRange?.start,
    to: customRange?.end,
  });

  const handlePeriodSelect = (value: PeriodType) => {
    if (value === "custom") {
      setIsCustomOpen(true);
    } else {
      onPeriodChange(value);
    }
  };

  const handleCustomApply = () => {
    if (tempRange.from && tempRange.to) {
      onCustomRangeChange({ start: tempRange.from, end: tempRange.to });
      onPeriodChange("custom");
      setIsCustomOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="glass-card border-glass-border hover:bg-secondary/50 min-w-[180px] justify-between"
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {periodLabel}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px] bg-card border-glass-border">
          {PERIOD_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handlePeriodSelect(option.value)}
              className={cn(
                "cursor-pointer",
                period === option.value && "bg-primary/10 text-primary"
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <span />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-card border-glass-border" align="start">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Selecione o período</h4>
            <CalendarComponent
              mode="range"
              selected={{ from: tempRange.from, to: tempRange.to }}
              onSelect={(range) => setTempRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              locale={ptBR}
              className="pointer-events-auto"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!tempRange.from || !tempRange.to}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
