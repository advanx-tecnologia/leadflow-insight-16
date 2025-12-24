-- Criar policy para permitir leitura pública dos leads no dashboard
CREATE POLICY "Leitura publica para dashboard" 
ON public.dados_cliente 
FOR SELECT 
USING (true);