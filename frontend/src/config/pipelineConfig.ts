import type { PipelineStage } from "../types/ticket";

/**
 * Mapeamento STATUS JIRA -> ETAPA DO PIPELINE.
 *
 * No sistema real este mapeamento vive em `config/pipeline.yaml` no backend
 * (ver spec.md) e é lido pelo PipelineService — nunca fica hardcoded dentro
 * de regra de negócio nem dentro de componentes React. Neste protótipo
 * visual, este arquivo cumpre o mesmo papel: é a ÚNICA fonte de verdade do
 * mapeamento, consumida por `services/pipelineService.ts`.
 */
export const JIRA_STATUS_TO_STAGE: Record<string, PipelineStage> = {
  "Pendente": "development",
  "Em Desenvolvimento": "development",
  "Desenvolvido": "development",

  "Revisão de Código": "testing",
  "Correções/Ajustes": "testing",
  "Liberar Release": "testing",
  "Em Teste": "testing",
  "Testar Release": "testing",

  "Concluído": "delivery",
};

export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  "attendance",
  "development",
  "testing",
  "delivery",
];

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  attendance: "Em Atendimento",
  development: "Em Desenvolvimento",
  testing: "Em Testes",
  delivery: "Em Entrega",
  unmapped: "Status Jira não mapeado",
};

export function resolveStageForJiraStatus(jiraStatus: string): PipelineStage {
  return JIRA_STATUS_TO_STAGE[jiraStatus] ?? "unmapped";
}
