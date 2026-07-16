import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Meta {
  metaLeads: number;
  metaContratos: number;
}

export type MetaScope = "month" | "global";

export interface UseMetasReturn {
  metaLeads: number;
  metaContratos: number;
  leadsDoMes: number;
  contratosDoMes: number;
  mesLabel: string;
  isLoading: boolean;
  saveMetas: (meta: Meta, scope: MetaScope) => Promise<boolean>;
}

const currentMonthKey = () => format(new Date(), "yyyy-MM");

export function useMetas(): UseMetasReturn {
  const [monthMeta, setMonthMeta] = useState<Meta | null>(null);
  const [globalMeta, setGlobalMeta] = useState<Meta>({ metaLeads: 0, metaContratos: 0 });
  const [leadsDoMes, setLeadsDoMes] = useState(0);
  const [contratosDoMes, setContratosDoMes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetas = useCallback(async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("metas")
      .select("mes, meta_leads, meta_contratos")
      .in("mes", [currentMonthKey(), "global"]);

    if (error) {
      console.error("Erro ao buscar metas:", error);
    } else {
      const rows = data ?? [];
      const month = rows.find((r) => r.mes === currentMonthKey());
      const global = rows.find((r) => r.mes === "global");
      setMonthMeta(month ? { metaLeads: month.meta_leads, metaContratos: month.meta_contratos } : null);
      if (global) setGlobalMeta({ metaLeads: global.meta_leads, metaContratos: global.meta_contratos });
    }

    // Progresso do mês atual contado no servidor (independe do filtro de período).
    const now = new Date();
    const monthStart = startOfMonth(now).toISOString();
    const monthEnd = endOfMonth(now).toISOString();

    const leadsRes = await supabase
      .from("dados_cliente")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd);
    if (leadsRes.count != null) setLeadsDoMes(leadsRes.count);

    const contratosRes = await supabase
      .from("dados_cliente")
      .select("*", { count: "exact", head: true })
      .eq("contrato_fechado", true)
      .gte("data_fechamento", monthStart)
      .lte("data_fechamento", monthEnd);
    if (contratosRes.count != null) setContratosDoMes(contratosRes.count);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMetas();
  }, [fetchMetas]);

  const saveMetas = useCallback(
    async (meta: Meta, scope: MetaScope): Promise<boolean> => {
      const mes = scope === "month" ? currentMonthKey() : "global";
      const { error } = await supabase.from("metas").upsert(
        {
          mes,
          meta_leads: meta.metaLeads,
          meta_contratos: meta.metaContratos,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "mes" }
      );

      if (error) {
        console.error("Erro ao salvar metas:", error);
        toast({ title: "Erro ao salvar metas", description: error.message, variant: "destructive" });
        return false;
      }

      if (scope === "month") setMonthMeta(meta);
      else setGlobalMeta(meta);

      toast({
        title: "Metas salvas",
        description: scope === "month" ? "Meta deste mês atualizada." : "Meta padrão atualizada.",
      });
      return true;
    },
    []
  );

  // Meta efetiva: mês atual se definida, senão a global (fallback).
  const effective = monthMeta ?? globalMeta;

  return {
    metaLeads: effective.metaLeads,
    metaContratos: effective.metaContratos,
    leadsDoMes,
    contratosDoMes,
    mesLabel: format(new Date(), "MMMM 'de' yyyy", { locale: ptBR }),
    isLoading,
    saveMetas,
  };
}
