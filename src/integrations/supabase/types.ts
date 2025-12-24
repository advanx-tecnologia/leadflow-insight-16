export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      atividades_lead: {
        Row: {
          created_at: string | null
          descricao: string
          id: string
          lead_id: number | null
          status_anterior: string | null
          status_novo: string | null
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: string
          lead_id?: number | null
          status_anterior?: string | null
          status_novo?: string | null
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: string
          lead_id?: number | null
          status_anterior?: string | null
          status_novo?: string | null
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atividades_lead_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "dados_cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_lead_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          created_at: string | null
          id: number
          message_type: string | null
          nomewpp: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          nomewpp?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          anuncio: string | null
          bairro: string | null
          bot: string | null
          campanha: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          conjunto: string | null
          contrato_assinado: boolean | null
          contrato_fechado: boolean | null
          cpf: string | null
          cpf_validado: boolean | null
          created_at: string | null
          data_audiencia: string | null
          data_fechamento: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          follow_up: boolean | null
          fonte: string | null
          id: number
          kanban: string | null
          logradouro: string | null
          nicho: string | null
          nome: string | null
          numero: string | null
          numero_processo: string | null
          numero_protocolo: string | null
          observacoes: string | null
          pipeline_tipo: string | null
          previsao_honorarios: number | null
          previsao_recebimento: string | null
          procedencia: string | null
          profissao: string | null
          responsavel_id: string | null
          rg: string | null
          status_pagamento: string | null
          telefone: string | null
          telefone_chat: string | null
          tese: string | null
          ticket_valor: number | null
          updated_at: string | null
          user_id: string | null
          valor_estimado_causa: number | null
        }
        Insert: {
          anuncio?: string | null
          bairro?: string | null
          bot?: string | null
          campanha?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          conjunto?: string | null
          contrato_assinado?: boolean | null
          contrato_fechado?: boolean | null
          cpf?: string | null
          cpf_validado?: boolean | null
          created_at?: string | null
          data_audiencia?: string | null
          data_fechamento?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          follow_up?: boolean | null
          fonte?: string | null
          id?: number
          kanban?: string | null
          logradouro?: string | null
          nicho?: string | null
          nome?: string | null
          numero?: string | null
          numero_processo?: string | null
          numero_protocolo?: string | null
          observacoes?: string | null
          pipeline_tipo?: string | null
          previsao_honorarios?: number | null
          previsao_recebimento?: string | null
          procedencia?: string | null
          profissao?: string | null
          responsavel_id?: string | null
          rg?: string | null
          status_pagamento?: string | null
          telefone?: string | null
          telefone_chat?: string | null
          tese?: string | null
          ticket_valor?: number | null
          updated_at?: string | null
          user_id?: string | null
          valor_estimado_causa?: number | null
        }
        Update: {
          anuncio?: string | null
          bairro?: string | null
          bot?: string | null
          campanha?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          conjunto?: string | null
          contrato_assinado?: boolean | null
          contrato_fechado?: boolean | null
          cpf?: string | null
          cpf_validado?: boolean | null
          created_at?: string | null
          data_audiencia?: string | null
          data_fechamento?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          follow_up?: boolean | null
          fonte?: string | null
          id?: number
          kanban?: string | null
          logradouro?: string | null
          nicho?: string | null
          nome?: string | null
          numero?: string | null
          numero_processo?: string | null
          numero_protocolo?: string | null
          observacoes?: string | null
          pipeline_tipo?: string | null
          previsao_honorarios?: number | null
          previsao_recebimento?: string | null
          procedencia?: string | null
          profissao?: string | null
          responsavel_id?: string | null
          rg?: string | null
          status_pagamento?: string | null
          telefone?: string | null
          telefone_chat?: string | null
          tese?: string | null
          ticket_valor?: number | null
          updated_at?: string | null
          user_id?: string | null
          valor_estimado_causa?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dados_cliente_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dados_cliente_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_status_atendimento: {
        Row: {
          aguardando_followup: boolean
          id: number
          lock_conversa: boolean
          numero_followup: number
          session_id: string
          updated_at: string
        }
        Insert: {
          aguardando_followup?: boolean
          id?: number
          lock_conversa?: boolean
          numero_followup?: number
          session_id: string
          updated_at?: string
        }
        Update: {
          aguardando_followup?: boolean
          id?: number
          lock_conversa?: boolean
          numero_followup?: number
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      nichos_juridicos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      processos: {
        Row: {
          created_at: string | null
          data_audiencia: string | null
          data_distribuicao: string | null
          data_sentenca: string | null
          fase_atual: string | null
          id: number
          juiz: string | null
          lead_id: number
          numero_processo: string | null
          observacoes: string | null
          resultado: string | null
          tribunal: string | null
          updated_at: string | null
          vara: string | null
        }
        Insert: {
          created_at?: string | null
          data_audiencia?: string | null
          data_distribuicao?: string | null
          data_sentenca?: string | null
          fase_atual?: string | null
          id?: number
          juiz?: string | null
          lead_id: number
          numero_processo?: string | null
          observacoes?: string | null
          resultado?: string | null
          tribunal?: string | null
          updated_at?: string | null
          vara?: string | null
        }
        Update: {
          created_at?: string | null
          data_audiencia?: string | null
          data_distribuicao?: string | null
          data_sentenca?: string | null
          fase_atual?: string | null
          id?: number
          juiz?: string | null
          lead_id?: number
          numero_processo?: string | null
          observacoes?: string | null
          resultado?: string | null
          tribunal?: string | null
          updated_at?: string | null
          vara?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "dados_cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          aprovado: boolean | null
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          aprovado?: boolean | null
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          aprovado?: boolean | null
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_metrics: {
        Args: { filter_days?: number }
        Returns: {
          contratos_fechados_periodo: number
          contratos_pendentes: number
          prazo_medio_recebimento: number
          tempo_medio_fechamento: number
          valor_total_a_receber: number
          valor_total_recebido: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "vendedor" | "visualizador"
      user_role: "admin" | "membro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "vendedor", "visualizador"],
      user_role: ["admin", "membro"],
    },
  },
} as const
