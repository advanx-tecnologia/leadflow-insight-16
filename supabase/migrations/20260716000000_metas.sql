-- Metas mensais de leads e contratos fechados.
-- mes = 'YYYY-MM' para meta de um mês específico, ou 'global' para a meta padrão (fallback).
create table if not exists public.metas (
  mes text primary key,
  meta_leads integer not null default 0,
  meta_contratos integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Meta padrão global (usada quando o mês atual ainda não tem meta própria).
insert into public.metas (mes, meta_leads, meta_contratos)
values ('global', 0, 0)
on conflict (mes) do nothing;

alter table public.metas enable row level security;

-- Painel interno usando anon key: permite ler e gravar metas.
drop policy if exists "metas_anon_all" on public.metas;
create policy "metas_anon_all"
  on public.metas for all
  to anon
  using (true)
  with check (true);
