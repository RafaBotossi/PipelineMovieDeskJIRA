import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Link2, Copy } from "lucide-react";
import type { Ticket } from "../types/ticket";
import { getTicketPipeline } from "../services/pipelineService";
import { PipelineCell } from "./PipelineCell";
import { MovideskStatusBadge, TicketTypeBadge } from "./StatusBadge";
import { ActionsMenu, type ActionsMenuItem } from "./ActionsMenu";
import { formatDateTime, formatRelative, truncate } from "../utils/format";
import { useShareLinks } from "../context/ShareLinksContext";
import { useToast } from "../context/ToastContext";
import { buildPublicUrl, DEFAULT_EXPIRATION } from "../services/shareLinkService";

export function TicketRow({
  ticket,
  onOpenShare,
}: {
  ticket: Ticket;
  onOpenShare: (ticket: Ticket) => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { getLinksForTicket, createShareLink } = useShareLinks();
  const showToast = useToast();

  const pipeline = getTicketPipeline(ticket);
  const { text: shortSummary, truncated } = truncate(ticket.firstInteractionSummary, 200);

  async function handleQuickCopy() {
    const links = getLinksForTicket(ticket.id);
    const active = links.find(
      (l) => !l.revokedAt && (!l.expiresAt || new Date(l.expiresAt).getTime() > Date.now())
    );
    const link = active ?? createShareLink(ticket.id, DEFAULT_EXPIRATION);
    try {
      await navigator.clipboard.writeText(buildPublicUrl(link.token));
    } catch {
      // ambiente sem permissão de clipboard
    }
    showToast("Link copiado para a área de transferência");
  }

  const actions: ActionsMenuItem[] = [
    { label: "Visualizar", icon: <Eye size={14} />, onClick: () => navigate(`/tickets/${ticket.id}`) },
    { label: "Gerar link de acompanhamento", icon: <Link2 size={14} />, onClick: () => onOpenShare(ticket) },
    { label: "Copiar link de acompanhamento", icon: <Copy size={14} />, onClick: handleQuickCopy },
  ];

  return (
    <tr className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/60">
      <td className="whitespace-nowrap px-4 py-3.5">
        <button
          type="button"
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className="font-mono text-sm font-semibold text-indigo-700 hover:underline"
        >
          #{ticket.id}
        </button>
      </td>

      <td className="max-w-[260px] px-4 py-3.5">
        <button
          type="button"
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className="text-left text-sm font-medium text-slate-800 hover:text-indigo-700"
        >
          {ticket.title}
        </button>
        <div className="mt-1.5">
          <TicketTypeBadge type={ticket.type} />
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <MovideskStatusBadge status={ticket.movideskStatus} />
      </td>

      <td className="max-w-[280px] px-4 py-3.5">
        <p className="text-xs leading-relaxed text-slate-500">
          {expanded ? ticket.firstInteractionSummary : shortSummary}
        </p>
        {truncated && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs font-medium text-indigo-600 hover:underline"
          >
            {expanded ? "ver menos" : "ver mais"}
          </button>
        )}
      </td>

      <td className="px-4 py-3.5">
        <PipelineCell pipeline={pipeline} />
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <p className="text-xs text-slate-600">{formatDateTime(ticket.updatedAt)}</p>
        <p className="text-[11px] text-slate-400">{formatRelative(ticket.updatedAt)}</p>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-right">
        <ActionsMenu items={actions} />
      </td>
    </tr>
  );
}
