import type { Development } from "../types/ticket";
import { PipelineStepper, type PipelineStepperProps } from "./PipelineStepper";

export function JiraPipeline({
  development,
  size = "md",
  showLabels = true,
  orientation = "horizontal",
}: {
  development: Development;
  size?: PipelineStepperProps["size"];
  showLabels?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  const hasJira = development.jiraKey !== null;

  return (
    <div className="flex flex-col gap-1.5">
      {hasJira && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">{development.name}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
            {development.jiraKey}
          </span>
        </div>
      )}
      <PipelineStepper
        stage={development.pipelineStage}
        jiraKey={development.jiraKey}
        jiraStatus={development.jiraStatus}
        skipsOptionalStages={development.skipsOptionalStages}
        size={size}
        showLabels={showLabels}
        orientation={orientation}
      />
    </div>
  );
}
