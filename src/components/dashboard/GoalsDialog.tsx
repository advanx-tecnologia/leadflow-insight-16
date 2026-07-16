import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Meta, MetaScope } from "@/hooks/useMetas";

interface GoalsDialogProps {
  metaLeads: number;
  metaContratos: number;
  mesLabel: string;
  onSave: (meta: Meta, scope: MetaScope) => Promise<boolean>;
}

export function GoalsDialog({ metaLeads, metaContratos, mesLabel, onSave }: GoalsDialogProps) {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState(String(metaLeads));
  const [contratos, setContratos] = useState(String(metaContratos));
  const [scope, setScope] = useState<MetaScope>("month");
  const [saving, setSaving] = useState(false);

  // Sincroniza os campos com a meta efetiva quando o dialog abre.
  useEffect(() => {
    if (open) {
      setLeads(String(metaLeads));
      setContratos(String(metaContratos));
    }
  }, [open, metaLeads, metaContratos]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(
      { metaLeads: Math.max(0, parseInt(leads) || 0), metaContratos: Math.max(0, parseInt(contratos) || 0) },
      scope
    );
    setSaving(false);
    if (ok) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass-card border-border/50 h-9 w-9 sm:h-10 sm:w-10"
          title="Configurar metas"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-glass-border">
        <DialogHeader>
          <DialogTitle>Metas mensais</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta-leads">Meta de leads</Label>
            <Input
              id="meta-leads"
              type="number"
              min={0}
              value={leads}
              onChange={(e) => setLeads(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta-contratos">Meta de contratos fechados</Label>
            <Input
              id="meta-contratos"
              type="number"
              min={0}
              value={contratos}
              onChange={(e) => setContratos(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Aplicar a</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as MetaScope)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Este mês ({mesLabel})</SelectItem>
                <SelectItem value="global">Meta padrão (todos os meses)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
