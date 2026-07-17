import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = {
  id: number;
  phone: string | null;
  nomewpp: string | null;
  user_message: string | null;
  bot_message: string | null;
  message_type: string | null;
  created_at: string | null;
  active: boolean | null;
};

export type LeadInfo = {
  id: number;
  nome: string | null;
  telefone: string | null;
  creativo_url: string | null;
  creativo_nome: string | null;
  fonte: string | null;
  qualificado: string | null;
  motivo_desqualificacao: string | null;
  analise_categoria: string | null;
  analise_resumo: string | null;
  analisado_ia_em: string | null;
};

export type Conversa = {
  phone: string;
  phoneDigits: string;
  nome: string;
  messages: ChatMessage[];
  ultimaData: string | null;
  lead?: LeadInfo;
};

// Só dígitos, ignora DDI/9 extra comparando os últimos 8 (núcleo do número).
const digits = (s?: string | null) => (s ?? "").replace(/\D/g, "");
const core = (s?: string | null) => digits(s).slice(-8);

async function fetchConversas(): Promise<Conversa[]> {
  const { data: msgs, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = (msgs ?? []) as ChatMessage[];

  // Agrupa por telefone.
  const grupos = new Map<string, Conversa>();
  for (const m of rows) {
    const phone = m.phone ?? "sem-telefone";
    let g = grupos.get(phone);
    if (!g) {
      g = {
        phone,
        phoneDigits: digits(phone),
        nome: m.nomewpp || phone,
        messages: [],
        ultimaData: null,
      };
      grupos.set(phone, g);
    }
    g.messages.push(m);
    g.ultimaData = m.created_at;
    if (m.nomewpp && (g.nome === phone || !g.nome)) g.nome = m.nomewpp;
  }

  const conversas = Array.from(grupos.values());

  // Liga cada conversa ao lead correspondente (nome + imagem do criativo).
  const cores = conversas.map((c) => core(c.phone)).filter(Boolean);
  if (cores.length) {
    const { data: leads } = await supabase
      .from("dados_cliente")
      .select(
        "id,nome,telefone,creativo_url,creativo_nome,fonte,qualificado,motivo_desqualificacao,analise_categoria,analise_resumo,analisado_ia_em",
      )
      .or(cores.map((c) => `telefone.ilike.%${c}%`).join(","));
    const byCore = new Map<string, LeadInfo>();
    for (const l of (leads ?? []) as LeadInfo[]) {
      const k = core(l.telefone);
      if (k && !byCore.has(k)) byCore.set(k, l);
    }
    for (const c of conversas) {
      const l = byCore.get(core(c.phone));
      if (l) {
        c.lead = l;
        if (l.nome) c.nome = l.nome;
      }
    }
  }

  // Mais recente primeiro.
  return conversas.sort((a, b) =>
    (b.ultimaData ?? "").localeCompare(a.ultimaData ?? ""),
  );
}

export function useConversas() {
  return useQuery({
    queryKey: ["conversas"],
    queryFn: fetchConversas,
    // Atualização manual (botão) — sem polling. Não desgasta o banco.
    // ponytail: sem refetchInterval; se quiser 1x/dia, cron externo invalida a query.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
