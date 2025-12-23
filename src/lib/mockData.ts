export interface Lead {
  id: string;
  created_at: string;
  nome: string;
  telefone: string;
  email?: string;
  fonte_conversa: string;
  status: string;
  cidade?: string;
  estado?: string;
}

export type LeadStatus = "Novo" | "Qualificado" | "Convertido" | "Perdido";

export const LEAD_SOURCES = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Google Ads",
  "Meta Ads",
  "Site",
  "Indicação",
  "LinkedIn",
];

export const LEAD_STATUSES: LeadStatus[] = ["Novo", "Qualificado", "Convertido", "Perdido"];

// Generate realistic mock data
function generateMockLeads(count: number = 500): Lead[] {
  const leads: Lead[] = [];
  const now = new Date();
  const names = [
    "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Souza",
    "Fernanda Lima", "Ricardo Alves", "Juliana Rocha", "Bruno Fernandes", "Camila Martins",
    "Lucas Pereira", "Beatriz Rodrigues", "Gabriel Nunes", "Larissa Barbosa", "Rafael Cardoso",
    "Amanda Ribeiro", "Thiago Mendes", "Isabela Carvalho", "Matheus Gomes", "Patricia Dias",
    "Felipe Moura", "Vanessa Correia", "Gustavo Nascimento", "Aline Ferreira", "Leonardo Teixeira",
  ];

  for (let i = 0; i < count; i++) {
    // Generate random date in the last 90 days with more recent bias
    const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(
      // Bias towards business hours (9-18) but allow some outside
      Math.random() > 0.3 ? 9 + Math.floor(Math.random() * 9) : Math.floor(Math.random() * 24),
      minutesAgo,
      0,
      0
    );

    // Bias towards weekdays
    const dayOfWeek = createdAt.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (Math.random() > 0.3) {
        createdAt.setDate(createdAt.getDate() + (dayOfWeek === 0 ? 1 : -1));
      }
    }

    const name = names[Math.floor(Math.random() * names.length)];
    const source = LEAD_SOURCES[Math.floor(Math.random() * LEAD_SOURCES.length)];
    
    // Status distribution: 40% Novo, 30% Qualificado, 20% Convertido, 10% Perdido
    const statusRand = Math.random();
    let status: LeadStatus;
    if (statusRand < 0.4) status = "Novo";
    else if (statusRand < 0.7) status = "Qualificado";
    else if (statusRand < 0.9) status = "Convertido";
    else status = "Perdido";

    leads.push({
      id: `lead-${i + 1}`,
      created_at: createdAt.toISOString(),
      nome: name,
      telefone: `(${11 + Math.floor(Math.random() * 89)}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      fonte_conversa: source,
      status,
    });
  }

  return leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const mockLeads = generateMockLeads(500);
