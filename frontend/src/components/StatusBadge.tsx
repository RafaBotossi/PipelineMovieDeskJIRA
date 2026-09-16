import clsx from "clsx";
import { Bug, Sparkles } from "lucide-react";
import type { TicketType } from "../types/ticket";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "progress";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  progress: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
    >
      {label}
    </span>
  );
}

const MOVIDESK_STATUS_TONE: Record<string, BadgeTone> = {
  Novo: "info",
  "Em Atendimento": "progress",
  "Aguardando Cliente": "warning",
  "Aguardando Terceiros": "warning",
  Reaberto: "danger",
  "Em Análise": "progress",
  Resolvido: "success",
  Fechado: "neutral",
};

export function MovideskStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={MOVIDESK_STATUS_TONE[status] ?? "neutral"} />;
}

export function TicketTypeBadge({ type }: { type: TicketType }) {
  const isBug = type === "bug";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
        isBug
          ? "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200"
          : "bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-200"
      )}
    >
      {isBug ? <Bug size={11} /> : <Sparkles size={11} />}
      {isBug ? "Bug" : "Melhoria"}
    </span>
  );
}
