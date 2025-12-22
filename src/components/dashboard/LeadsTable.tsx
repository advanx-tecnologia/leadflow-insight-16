import { useState, useMemo } from "react";
import { Lead } from "@/lib/mockData";
import { formatDateTime } from "@/lib/dateUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

export function LeadsTable({ leads, isLoading }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const perPage = 10;

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
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page]);

  const totalPages = Math.ceil(sorted.length / perPage);

  const exportCSV = () => {
    const headers = ["Data/Hora", "Nome", "Telefone", "Fonte", "Status"];
    const rows = sorted.map((l) => [formatDateTime(l.created_at), l.nome, l.telefone, l.fonte_conversa, l.status]);
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

  if (isLoading) {
    return <div className="glass-card p-6 h-[400px] animate-pulse bg-muted/20" />;
  }

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Dados dos Leads</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary/50 border-glass-border" />
          </div>
          <Button variant="outline" size="icon" onClick={exportCSV} className="border-glass-border">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-glass-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-glass-border">
              <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>Data/Hora</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("fonte_conversa")}>Fonte</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((lead) => (
              <TableRow key={lead.id} className="border-glass-border">
                <TableCell className="text-muted-foreground">{formatDateTime(lead.created_at)}</TableCell>
                <TableCell className="font-medium">{lead.nome}</TableCell>
                <TableCell>{lead.telefone}</TableCell>
                <TableCell><span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{lead.fonte_conversa}</span></TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs ${lead.status === "Convertido" ? "bg-success/10 text-success" : lead.status === "Perdido" ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>{lead.status}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">{sorted.length} leads encontrados</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="border-glass-border h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm">{page} / {totalPages || 1}</span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border-glass-border h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
