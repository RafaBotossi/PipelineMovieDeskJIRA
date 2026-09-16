import type { Development, Ticket, TicketPipeline } from "../types/ticket";
import { resolveStageForJiraStatus } from "../config/pipelineConfig";

// Status Movidesk que indicam que o atendimento foi encerrado sem precisar
// de desenvolvimento — o pipeline vai direto de "Em Atendimento" para
// "Concluído", pulando as etapas opcionais.
const RESOLVED_MOVIDESK_STATUSES = ["Resolvido", "Fechado"];

/**
 * PipelineService (protótipo)
 *
 * Concentra toda a regra de determinação do pipeline. O frontend nunca
 * decide etapas a partir de string de status — ele apenas renderiza o que
 * esta camada devolve, no mesmo formato que o backend real (FastAPI)
 * devolveria via `GET /api/tickets/{id}/pipeline`:
 *
 * {
 *   "ticket_id": 12345,
 *   "developments": [
 *     { "name": "Desenvolvimento 1", "jira_key": "DEV-123", "jira_status": "Em Teste", "pipeline_stage": "testing" }
 *   ]
 * }
 *
 * A relação Movidesk -> Jira (0, 1 ou N tickets Jira) já vem resolvida em
 * `ticket.jiraIssues`, papel que no backend real caberia a um
 * MovideskJiraResolver / TicketRelationService dedicado.
 */
export function getTicketPipeline(ticket: Ticket): TicketPipeline {
  if (ticket.jiraIssues.length === 0) {
    const resolvedWithoutDevelopment = RESOLVED_MOVIDESK_STATUSES.includes(ticket.movideskStatus);
    const development: Development = {
      name: "Atendimento",
      jiraKey: null,
      jiraTitle: null,
      jiraStatus: null,
      pipelineStage: resolvedWithoutDevelopment ? "delivery" : "attendance",
      updatedAt: ticket.updatedAt,
      skipsOptionalStages: resolvedWithoutDevelopment,
    };
    return { ticketId: ticket.id, developments: [development] };
  }

  const developments: Development[] = ticket.jiraIssues.map((issue, index) => {
    const stage = resolveStageForJiraStatus(issue.status);

    if (stage === "unmapped") {
      // eslint-disable-next-line no-console
      console.warn("[pipeline] Status Jira não mapeado", {
        jira: issue.key,
        statusRecebido: issue.status,
        ticketMovidesk: ticket.id,
      });
    }

    return {
      name:
        ticket.jiraIssues.length === 1
          ? "Desenvolvimento"
          : `Desenvolvimento ${index + 1}`,
      jiraKey: issue.key,
      jiraTitle: issue.title,
      jiraStatus: issue.status,
      pipelineStage: stage,
      updatedAt: issue.updatedAt,
      skipsOptionalStages: false,
    };
  });

  return { ticketId: ticket.id, developments };
}

/** Etapa "resumo" usada na coluna Pipeline da tabela principal (a mais avançada entre os desenvolvimentos). */
export function getSummaryStage(pipeline: TicketPipeline): Development["pipelineStage"] {
  const order = ["attendance", "unmapped", "development", "testing", "delivery"] as const;
  return pipeline.developments.reduce<Development["pipelineStage"]>((acc, dev) => {
    return order.indexOf(dev.pipelineStage) > order.indexOf(acc) ? dev.pipelineStage : acc;
  }, "attendance");
}
