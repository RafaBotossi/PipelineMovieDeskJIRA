import clsx from "clsx";
import { Check, ChevronDown, HelpCircle } from "lucide-react";
import type { PipelineStage } from "../types/ticket";
import { PIPELINE_STAGE_LABEL, PIPELINE_STAGE_ORDER } from "../config/pipelineConfig";
import { Tooltip } from "./Tooltip";

type StepState = "done" | "current" | "future" | "unmapped";

function computeStepStates(stage: PipelineStage): StepState[] {
  if (stage === "unmapped") {
    return ["done", "unmapped", "future", "future"];
  }
  const currentIdx = PIPELINE_STAGE_ORDER.indexOf(stage);
  return PIPELINE_STAGE_ORDER.map((_, idx) =>
    idx < currentIdx ? "done" : idx === currentIdx ? "current" : "future"
  );
}

const CIRCLE_BASE =
  "flex items-center justify-center rounded-full border-2 shrink-0 transition-colors";

function StepCircle({ state, size }: { state: StepState; size: "sm" | "md" }) {
  const dims = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const iconSize = size === "sm" ? 11 : 14;

  if (state === "done") {
    return (
      <span className={clsx(CIRCLE_BASE, dims, "border-emerald-500 bg-emerald-500 text-white")}>
        <Check size={iconSize} strokeWidth={3} />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span
        className={clsx(
          CIRCLE_BASE,
          dims,
          "border-indigo-600 bg-indigo-600 ring-4 ring-indigo-100"
        )}
      />
    );
  }
  if (state === "unmapped") {
    return (
      <span className={clsx(CIRCLE_BASE, dims, "border-amber-400 bg-amber-100 text-amber-700")}>
        <HelpCircle size={iconSize} />
      </span>
    );
  }
  return <span className={clsx(CIRCLE_BASE, dims, "border-slate-300 bg-white")} />;
}

const CONNECTOR_STATE_CLASS: Record<StepState, string> = {
  done: "bg-emerald-500",
  current: "bg-slate-200",
  unmapped: "bg-slate-200",
  future: "bg-slate-200",
};

export interface PipelineStepperProps {
  stage: PipelineStage;
  jiraKey?: string | null;
  jiraStatus?: string | null;
  size?: "sm" | "md";
  showLabels?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function PipelineStepper({
  stage,
  jiraKey,
  jiraStatus,
  size = "md",
  showLabels = true,
  orientation = "horizontal",
  className,
}: PipelineStepperProps) {
  const states = computeStepStates(stage);

  if (orientation === "vertical") {
    return (
      <div className={clsx("flex flex-col", className)}>
        {PIPELINE_STAGE_ORDER.map((stepStage, idx) => {
          const state = states[idx];
          return (
            <div key={stepStage} className="flex flex-col items-center">
              <div className="flex items-center gap-3 self-stretch">
                <StepCircle state={state} size={size} />
                <span
                  className={clsx(
                    "text-sm",
                    state === "done" && "font-medium text-slate-700",
                    state === "current" && "font-semibold text-indigo-700",
                    state === "unmapped" && "font-semibold text-amber-700",
                    state === "future" && "text-slate-400"
                  )}
                >
                  {PIPELINE_STAGE_LABEL[stepStage]}
                </span>
              </div>
              {idx < PIPELINE_STAGE_ORDER.length - 1 && (
                <ChevronDown
                  size={14}
                  className={clsx(
                    "my-0.5 ml-[9px]",
                    state === "done" ? "text-emerald-500" : "text-slate-300"
                  )}
                />
              )}
            </div>
          );
        })}
        {stage === "unmapped" && (
          <p className="mt-1 text-[11px] font-medium text-amber-700">
            Status Jira não mapeado{jiraStatus ? `: "${jiraStatus}"` : ""}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <div className="flex items-center">
        {PIPELINE_STAGE_ORDER.map((stepStage, idx) => {
          const state = states[idx];
          const circle = <StepCircle state={state} size={size} />;
          const wrapped =
            state === "current" || state === "unmapped" ? (
              <Tooltip
                content={
                  state === "unmapped" ? (
                    <>
                      <div className="font-semibold">Status Jira não mapeado</div>
                      {jiraKey && <div>Jira: {jiraKey}</div>}
                      {jiraStatus && <div>Status Jira: {jiraStatus}</div>}
                    </>
                  ) : jiraKey ? (
                    <>
                      <div>Jira: {jiraKey}</div>
                      {jiraStatus && <div>Status Jira: {jiraStatus}</div>}
                    </>
                  ) : (
                    <div>{PIPELINE_STAGE_LABEL[stepStage]}</div>
                  )
                }
              >
                {circle}
              </Tooltip>
            ) : (
              circle
            );

          return (
            <div key={stepStage} className="flex flex-1 items-center last:flex-none">
              {wrapped}
              {idx < PIPELINE_STAGE_ORDER.length - 1 && (
                <span
                  className={clsx(
                    "mx-1 h-0.5 flex-1 rounded-full",
                    state === "done" ? CONNECTOR_STATE_CLASS.done : CONNECTOR_STATE_CLASS.future
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {showLabels && (
        <div className="flex text-[11px] text-slate-500">
          {PIPELINE_STAGE_ORDER.map((stepStage, idx) => (
            <div
              key={stepStage}
              className={clsx(
                "flex-1 text-center first:text-left last:flex-none last:text-right",
                states[idx] === "current" && "font-semibold text-indigo-700",
                states[idx] === "unmapped" && "font-semibold text-amber-700"
              )}
              style={{ maxWidth: `${100 / PIPELINE_STAGE_ORDER.length}%` }}
            >
              {PIPELINE_STAGE_LABEL[stepStage]}
            </div>
          ))}
        </div>
      )}

      {stage === "unmapped" && (
        <p className="text-[11px] font-medium text-amber-700">
          Status Jira não mapeado{jiraStatus ? `: "${jiraStatus}"` : ""}
        </p>
      )}
    </div>
  );
}
