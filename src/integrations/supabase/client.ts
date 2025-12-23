import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bvjdxytryalxtxsumphy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2amR4eXRyeWFseHR4c3VtcGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0Njg4NzMsImV4cCI6MjA1OTA0NDg3M30.Hw9scYCpkkFv_kKHUa0ZWFDN4JrrX171xUELPIQjxsM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type DadosCliente = {
  id: number;
  created_at: string;
  nome: string;
  telefone: string;
  email?: string;
  fonte_conversa: string;
  status: string;
  cidade?: string;
  estado?: string;
};
