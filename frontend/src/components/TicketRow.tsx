import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link2 } from "lucide-react";
import type { Ticket } from "../types/ticket";
import { getTicketPipeline } from "../services/pipelineService";
import { PipelineStepper } from "./PipelineStepper";
import { MovideskStatusBadge, TicketTypeBadge } from "./StatusBadge";
import { formatDateTime, formatRelative } from "../utils/format";
import { useShareLinks } from "../context/ShareLinksContext";
import { useToast } from "../context/ToastContext";
import { buildPublicUrl, DEFAULT_EXPIRATION } from "../services/shareLinkService";

export function TicketRow({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const { getLinksForTicket, createShareLink } = useShareLinks();
  const showToast = useToast();

  const pipeline = getTicketPipeline(ticket);

  useLayoutEffect(() => {
    const el = summaryRef.current;
    if (el) setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [ticket.firstInteractionSummary]);

  async function handleFollowUpLink() {
    const links = getLinksForTicket(ticket.id);
    const active = links.find(
      (l) => !l.revokedAt && (!l.expiresAt || new Date(l.expiresAt).getTime() > Date.now())
    );
    const link = active ?? createShareLink(ticket.id, DEFAULT_EXPIRATION);
    const url = buildPublicUrl(link.token);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ambiente sem permissão de clipboard — o link ainda abre normalmente
    }
    showToast("Link copiado para a área de transferência");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      {/* Linha 1: ticket, título, tipo e atualização */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="font-mono text-sm font-semibold text-indigo-700 hover:underline"
          >
            #{ticket.id}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="text-left text-sm font-medium leading-snug text-slate-800 hover:text-indigo-700"
          >
            {ticket.title}
          </button>
          <TicketTypeBadge type={ticket.type} />
          <MovideskStatusBadge status={ticket.movideskStatus} />
        </div>

        <div className="min-w-[136px] shrink-0 whitespace-nowrap text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Atualização (Movidesk)
          </p>
          <p className="text-xs text-slate-600">{formatDateTime(ticket.updatedAt)}</p>
          <p className="text-[11px] text-slate-400">{formatRelative(ticket.updatedAt)}</p>
        </div>
      </div>

      {/* Linha 2: resumo da primeira interação, ocupando a largura toda */}
      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Resumo da Primeira Interação
        </p>
        <p
          ref={summaryRef}
          className={clsx(
            "mt-0.5 text-sm leading-relaxed text-slate-600",
            !expanded && "line-clamp-6"
          )}
        >
          {ticket.firstInteractionSummary}
        </p>
        {!expanded && canExpand && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-1 text-xs font-medium text-indigo-600 hover:underline"
          >
            ver mais
          </button>
        )}
      </div>

      {/* Linha 3+: pipeline visual, com o botão de link de acompanhamento na mesma linha */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
        {pipeline.developments.map((dev, idx) => (
          <div key={dev.jiraKey ?? "attendance"} className="flex flex-wrap items-center gap-4">
            <span className="w-[92px] shrink-0 truncate text-xs font-semibold text-slate-500">
              {dev.jiraKey ?? "Atendimento"}
            </span>
            <PipelineStepper
              stage={dev.pipelineStage}
              jiraKey={dev.jiraKey}
              jiraStatus={dev.jiraStatus}
              size="lg"
              showLabels
              className="max-w-xl flex-1"
            />
            <span
              className={clsx(
                "shrink-0 whitespace-nowrap text-[11px] text-slate-400",
                idx > 0 && "ml-auto"
              )}
            >
              {dev.jiraKey ? "Atualização Jira" : "Atualização"}: {formatDateTime(dev.updatedAt)}
            </span>
            {idx === 0 && (
              <button
                type="button"
                onClick={handleFollowUpLink}
                className="ml-auto flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <Link2 size={16} />
                Link de Acompanhamento
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
