import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface SourceFilterProps {
  sources: string[];
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export function SourceFilter({ sources, selectedSource, onSourceChange }: SourceFilterProps) {
  return (
    <Select value={selectedSource} onValueChange={onSourceChange}>
      <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-glass-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Filtrar por fonte" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card border-glass-border z-50">
        <SelectItem value="all">Todas as fontes</SelectItem>
        {sources.map((source) => (
          <SelectItem key={source} value={source}>
            {source}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
