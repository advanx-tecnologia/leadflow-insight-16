import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, MessageSquare, ImageOff, RefreshCw, Sparkles } from "lucide-react";
import { useConversas, type Conversa } from "@/hooks/useConversas";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function QualBadge({ q }: { q?: string | null }) {
  if (q === "sim") return <Badge className="bg-green-600">Qualificado</Badge>;
  if (q === "nao") return <Badge variant="destructive">Desqualificado</Badge>;
  return <Badge variant="secondary">Sem análise</Badge>;
}

export default function Conversas() {
  const { data: conversas = [], isLoading, isFetching, error, refetch } = useConversas();
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [analisando, setAnalisando] = useState(false);

  async function analisarIA() {
    setAnalisando(true);
    try {
      const { error: e } = await supabase.functions.invoke("analisa-conversas");
      if (e) throw e;
      await refetch();
    } catch (err) {
      alert("Falha ao analisar: " + (err as Error).message);
    } finally {
      setAnalisando(false);
    }
  }

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return conversas;
    return conversas.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) || c.phoneDigits.includes(q.replace(/\D/g, "")),
    );
  }, [conversas, busca]);

  const atual: Conversa | undefined = useMemo(
    () => filtradas.find((c) => c.phone === sel) ?? filtradas[0],
    [filtradas, sel],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <MessageSquare className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Conversas</h1>
        <Badge variant="outline" className="ml-auto">
          {conversas.length} contato{conversas.length !== 1 ? "s" : ""}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4 mr-1", isFetching && "animate-spin")} />
          Atualizar
        </Button>
        <Button
          size="sm"
          onClick={analisarIA}
          disabled={analisando}
        >
          <Sparkles className={cn("h-4 w-4 mr-1", analisando && "animate-pulse")} />
          {analisando ? "Analisando..." : "Analisar com IA"}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0 h-[calc(100vh-57px)]">
        {/* Lista */}
        <aside className="border-r flex flex-col min-h-0">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nome ou telefone"
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {isLoading && <p className="p-4 text-sm text-muted-foreground">Carregando…</p>}
            {error && <p className="p-4 text-sm text-destructive">Erro ao carregar.</p>}
            {!isLoading && filtradas.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa.</p>
            )}
            {filtradas.map((c) => (
              <button
                key={c.phone}
                onClick={() => setSel(c.phone)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b hover:bg-accent transition-colors",
                  atual?.phone === c.phone && "bg-accent",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{c.nome}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {fmt(c.ultimaData)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground truncate">
                    {c.phoneDigits}
                  </span>
                  {c.lead?.qualificado === "nao" && (
                    <span className="text-xs text-destructive">• desqualificado</span>
                  )}
                </div>
              </button>
            ))}
          </ScrollArea>
        </aside>

        {/* Detalhe */}
        <section className="flex flex-col min-h-0">
          {!atual ? (
            <div className="flex-1 grid place-items-center text-muted-foreground">
              Selecione uma conversa
            </div>
          ) : (
            <>
              <div className="border-b p-4 flex items-start gap-4">
                {/* Imagem do criativo que trouxe o lead */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 grid place-items-center">
                  {atual.lead?.creativo_url ? (
                    <img
                      src={atual.lead.creativo_url}
                      alt="Criativo do anúncio"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ImageOff className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg">{atual.nome}</h2>
                  <p className="text-sm text-muted-foreground">{atual.phoneDigits}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <QualBadge q={atual.lead?.qualificado} />
                    {atual.lead?.fonte && (
                      <Badge variant="outline">{atual.lead.fonte}</Badge>
                    )}
                    {atual.lead?.creativo_nome && (
                      <Badge variant="outline">{atual.lead.creativo_nome}</Badge>
                    )}
                  </div>
                  {atual.lead?.motivo_desqualificacao && (
                    <p className="text-sm text-destructive mt-2">
                      Motivo: {atual.lead.motivo_desqualificacao}
                    </p>
                  )}
                  {atual.lead?.analise_resumo && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold">Relatório IA</span>
                        {atual.lead.analise_categoria && (
                          <Badge variant="secondary" className="text-[10px]">
                            {atual.lead.analise_categoria}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{atual.lead.analise_resumo}</p>
                      {atual.lead.analisado_ia_em && (
                        <span className="text-[10px] text-muted-foreground">
                          analisado em {fmt(atual.lead.analisado_ia_em)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                  {atual.messages.map((m) => (
                    <div key={m.id} className="flex flex-col gap-2">
                      {/* Recebida (lead) */}
                      {m.user_message && (
                        <div className="self-start max-w-[80%]">
                          <Card className="px-3 py-2 bg-muted">
                            <p className="text-sm whitespace-pre-wrap">{m.user_message}</p>
                          </Card>
                          <span className="text-[10px] text-muted-foreground ml-1">
                            recebida · {fmt(m.created_at)}
                          </span>
                        </div>
                      )}
                      {/* Enviada (bot) */}
                      {m.bot_message && (
                        <div className="self-end max-w-[80%]">
                          <Card className="px-3 py-2 bg-primary text-primary-foreground">
                            <p className="text-sm whitespace-pre-wrap">{m.bot_message}</p>
                          </Card>
                          <span className="text-[10px] text-muted-foreground mr-1 block text-right">
                            enviada · {fmt(m.created_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
