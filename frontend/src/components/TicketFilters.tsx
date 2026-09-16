import { Search, X } from "lucide-react";
import clsx from "clsx";
import type { PipelineStage, TicketFiltersState, TicketType } from "../types/ticket";
import { PIPELINE_STAGE_LABEL, PIPELINE_STAGE_ORDER } from "../config/pipelineConfig";
import { ALL_MOVIDESK_STATUSES } from "../data/mockTickets";
import { TICKET_TYPE_LABEL } from "./StatusBadge";

const TICKET_TYPE_OPTIONS: TicketType[] = ["bug", "melhoria", "duvida"];

const JIRA_PRESENCE_OPTIONS: { value: TicketFiltersState["jiraPresence"]; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "with", label: "Possui Jira" },
  { value: "without", label: "Sem Jira" },
];

export function TicketFilters({
  value,
  onChange,
  resultCount,
}: {
  value: TicketFiltersState;
  onChange: (next: TicketFiltersState) => void;
  resultCount: number;
}) {
  const hasActiveFilters =
    value.search !== "" ||
    value.ticketType !== null ||
    value.movideskStatus !== null ||
    value.pipelineStage !== null ||
    value.jiraPresence !== "all";

  function clearAll() {
    onChange({
      search: "",
      ticketType: null,
      movideskStatus: null,
      pipelineStage: null,
      jiraPresence: "all",
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Buscar por nº do ticket, título ou chave Jira…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={value.ticketType ?? ""}
          onChange={(e) =>
            onChange({ ...value, ticketType: (e.target.value || null) as TicketType | null })
          }
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Tipo do Ticket (todos)</option>
          {TICKET_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {TICKET_TYPE_LABEL[type]}
            </option>
          ))}
        </select>

        <select
          value={value.movideskStatus ?? ""}
          onChange={(e) => onChange({ ...value, movideskStatus: e.target.value || null })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Status do Atendimento (todos)</option>
          {ALL_MOVIDESK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={value.pipelineStage ?? ""}
          onChange={(e) =>
            onChange({ ...value, pipelineStage: (e.target.value || null) as PipelineStage | null })
          }
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Etapa do Pipeline (todas)</option>
          {PIPELINE_STAGE_ORDER.map((stage) => (
            <option key={stage} value={stage}>
              {PIPELINE_STAGE_LABEL[stage]}
            </option>
          ))}
          <option value="unmapped">{PIPELINE_STAGE_LABEL.unmapped}</option>
        </select>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {JIRA_PRESENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...value, jiraPresence: opt.value })}
              className={clsx(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                value.jiraPresence === opt.value
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} />
            Limpar filtros
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">
        {resultCount} {resultCount === 1 ? "ticket encontrado" : "tickets encontrados"}
      </p>
    </div>
  );
}
