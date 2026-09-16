export type TicketType = "bug" | "melhoria" | "duvida";

/**
 * Etapas do pipeline. "unmapped" representa um status Jira que não possui
 * correspondência configurada (ver config/pipelineConfig.ts).
 */
export type PipelineStage =
  | "attendance"
  | "development"
  | "testing"
  | "delivery"
  | "unmapped";

export interface JiraIssue {
  key: string;
  title: string;
  status: string;
  updatedAt: string;
}

export interface Ticket {
  /** Número do ticket no formato Movidesk, ex.: "20260916000102". */
  id: string;
  title: string;
  type: TicketType;
  movideskStatus: string;
  firstInteractionSummary: string;
  requester: string | null;
  createdAt: string;
  updatedAt: string;
  jiraIssues: JiraIssue[];
  /**
   * Alerta apenas para uso interno (nunca exibido na página pública de
   * acompanhamento). Usado, por exemplo, para sinalizar um ticket
   * Resolvido/Fechado no Movidesk que ainda possui desenvolvimento Jira em
   * andamento — uma inconsistência real que a equipe interna precisa revisar.
   */
  internalAlert: string | null;
}

/** Uma linha de desenvolvimento dentro do pipeline de um ticket. */
export interface Development {
  name: string;
  jiraKey: string | null;
  jiraTitle: string | null;
  jiraStatus: string | null;
  pipelineStage: PipelineStage;
  updatedAt: string;
  /**
   * true quando o item foi direto de "Em Atendimento" para "Concluído" sem
   * passar por desenvolvimento/testes (ex.: ticket sem Jira resolvido
   * diretamente pelo atendente) — nesse caso a UI não deve desenhar as
   * bolinhas das etapas opcionais puladas.
   */
  skipsOptionalStages: boolean;
}

/** Formato retornado pela camada de regra de negócio (services/pipelineService). */
export interface TicketPipeline {
  ticketId: string;
  developments: Development[];
}

export type ExpirationOption = "24h" | "7d" | "30d" | "never";

export interface ShareLink {
  id: string;
  ticketId: string;
  token: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastAccessAt: string | null;
  accessCount: number;
}

export interface TicketFiltersState {
  search: string;
  ticketType: TicketType | null;
  movideskStatus: string | null;
  pipelineStage: PipelineStage | null;
  jiraPresence: "all" | "with" | "without";
}
