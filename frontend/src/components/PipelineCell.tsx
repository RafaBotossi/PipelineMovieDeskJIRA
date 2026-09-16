import type { PipelineStage, TicketPipeline } from "../types/ticket";
import { PIPELINE_STAGE_LABEL } from "../config/pipelineConfig";
import { PipelineStepper } from "./PipelineStepper";
import { StatusBadge, type BadgeTone } from "./StatusBadge";

const STAGE_TONE: Record<PipelineStage, BadgeTone> = {
  attendance: "info",
  development: "progress",
  testing: "warning",
  delivery: "success",
  unmapped: "danger",
};

/** Versão compacta do pipeline usada na coluna "Pipeline" da tabela principal. */
export function PipelineCell({ pipeline }: { pipeline: TicketPipeline }) {
  return (
    <div className="flex min-w-[260px] flex-col gap-2">
      {pipeline.developments.map((dev) => (
        <div key={`${dev.name}-${dev.jiraKey ?? "none"}`} className="flex items-center gap-2.5">
          <span className="w-[84px] shrink-0 truncate text-[11px] font-medium text-slate-500">
            {dev.jiraKey ?? dev.name}
          </span>
          <PipelineStepper
            stage={dev.pipelineStage}
            jiraKey={dev.jiraKey}
            jiraStatus={dev.jiraStatus}
            size="sm"
            showLabels={false}
            className="flex-1"
          />
          <StatusBadge
            label={PIPELINE_STAGE_LABEL[dev.pipelineStage]}
            tone={STAGE_TONE[dev.pipelineStage]}
            className="w-[104px] shrink-0 justify-center text-center"
          />
        </div>
      ))}
    </div>
  );
}
