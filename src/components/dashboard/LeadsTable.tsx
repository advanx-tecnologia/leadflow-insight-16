import { useState, useMemo } from "react";
import { Lead, KANBAN_STATUSES } from "@/lib/mockData";
import { formatDateTime } from "@/lib/dateUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChevronLeft, ChevronRight, FileCheck } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => Promise<boolean>;
}

export function LeadsTable({ leads, isLoading, onUpdateLead }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(50);

  const filtered = useMemo(() => {
    return leads.filter((l) =>
      l.nome.toLowerCase().includes(search.toLowerCase()) ||
      l.telefone.includes(search) ||
      l.fonte_conversa.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = (aVal ?? "") < (bVal ?? "") ? -1 : (aVal ?? "") > (bVal ?? "") ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page]);

  const totalPages = Math.ceil(sorted.length / perPage);

  const exportCSV = () => {
    const headers = ["Data/Hora", "Nome", "Telefone", "Fonte", "Status", "Kanban", "Contrato Fechado"];
    const rows = sorted.map((l) => [
      formatDateTime(l.created_at), 
      l.nome, 
      l.telefone, 
      l.fonte_conversa, 
      l.status,
      l.kanban ?? "",
      l.contrato_fechado ? "Sim" : "Não"
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleContratoChange = async (lead: Lead, checked: boolean) => {
    if (!onUpdateLead) return;
    
    setUpdatingIds(prev => new Set(prev).add(lead.id));
    await onUpdateLead(lead.id, { contrato_fechado: checked });
    setUpdatingIds(prev => {
      const next = new Set(prev);
      next.delete(lead.id);
      return next;
    });
  };

  const handleKanbanChange = async (lead: Lead, newKanban: string) => {
    if (!onUpdateLead) return;
    
    setUpdatingIds(prev => new Set(prev).add(lead.id));
    await onUpdateLead(lead.id, { kanban: newKanban });
    setUpdatingIds(prev => {
      const next = new Set(prev);
      next.delete(lead.id);
      return next;
    });
  };

  if (isLoading) {
    return <div className="glass-card p-6 h-[400px] animate-pulse bg-muted/20" />;
  }

  return (
    <div className="glass-card p-4 sm:p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Dados dos Leads</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              className="pl-9 bg-secondary/50 border-glass-border" 
            />
          </div>
          <Button variant="outline" size="icon" onClick={exportCSV} className="border-glass-border">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tabela com scroll horizontal em mobile */}
      <div className="rounded-lg border border-glass-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-glass-border">
              <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => handleSort("created_at")}>
                Data/Hora
              </TableHead>
              <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => handleSort("nome")}>
                Nome
              </TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">Telefone</TableHead>
              <TableHead className="cursor-pointer whitespace-nowrap hidden sm:table-cell" onClick={() => handleSort("fonte_conversa")}>
                Fonte
              </TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span className="hidden lg:inline">Contrato</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((lead) => {
              const isUpdating = updatingIds.has(lead.id);
              return (
                <TableRow key={lead.id} className="border-glass-border">
                  <TableCell className="text-foreground whitespace-nowrap">
                    {formatDateTime(lead.created_at)}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{lead.nome || "(Sem nome)"}</TableCell>
                  <TableCell className="hidden md:table-cell">{lead.telefone}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary whitespace-nowrap">
                      {lead.fonte_conversa}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.kanban ?? "Novo Lead"}
                      onValueChange={(value) => handleKanbanChange(lead, value)}
                      disabled={isUpdating || !onUpdateLead}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary/50 border-glass-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-glass-border z-50">
                        {KANBAN_STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={lead.contrato_fechado ?? false}
                      onCheckedChange={(checked) => handleContratoChange(lead, checked)}
                      disabled={isUpdating || !onUpdateLead}
                      className="data-[state=checked]:bg-success"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <span className="text-sm text-muted-foreground">{sorted.length} leads encontrados</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mostrar:</span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[80px] h-8 text-xs bg-secondary/50 border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-glass-border">
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)} 
              className="border-glass-border h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{page} / {totalPages || 1}</span>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)} 
              className="border-glass-border h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
