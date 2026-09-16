export type TicketType = "bug" | "melhoria";

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
  id: number;
  title: string;
  type: TicketType;
  movideskStatus: string;
  firstInteractionSummary: string;
  requester: string | null;
  createdAt: string;
  updatedAt: string;
  jiraIssues: JiraIssue[];
}

/** Uma linha de desenvolvimento dentro do pipeline de um ticket. */
export interface Development {
  name: string;
  jiraKey: string | null;
  jiraTitle: string | null;
  jiraStatus: string | null;
  pipelineStage: PipelineStage;
  updatedAt: string;
}

/** Formato retornado pela camada de regra de negócio (services/pipelineService). */
export interface TicketPipeline {
  ticketId: number;
  developments: Development[];
}

export type ExpirationOption = "24h" | "7d" | "30d" | "never";

export interface ShareLink {
  id: string;
  ticketId: number;
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
  movideskStatus: string | null;
  pipelineStage: PipelineStage | null;
  jiraPresence: "all" | "with" | "without";
}
