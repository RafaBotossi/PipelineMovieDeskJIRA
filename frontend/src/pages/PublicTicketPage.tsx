import { useEffect, useRef, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ShieldAlert, Workflow } from "lucide-react";
import { useShareLinks } from "../context/ShareLinksContext";
import { findTicketById } from "../data/mockTickets";
import { getTicketPipeline } from "../services/pipelineService";
import { MovideskStatusBadge, TicketTypeBadge } from "../components/StatusBadge";
import { JiraPipeline } from "../components/JiraPipeline";
import { formatDateTime, truncate } from "../utils/format";

function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10">
      <div className="mb-6 flex items-center gap-2 text-slate-500">
        <Workflow size={18} className="text-indigo-600" />
        <span className="text-sm font-semibold">Pipeline de Atendimento</span>
      </div>
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}

export default function PublicTicketPage() {
  const { token } = useParams();
  const { resolveToken, registerAccess } = useShareLinks();
  const resolution = token ? resolveToken(token) : { status: "not_found" as const };
  const registeredRef = useRef<string | null>(null);

  useEffect(() => {
    if (token && resolution.status === "ok" && registeredRef.current !== token) {
      registeredRef.current = token;
      registerAccess(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resolution.status]);

  if (resolution.status !== "ok") {
    return (
      <PublicShell>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShieldAlert size={28} className="text-slate-300" />
          <p className="text-base font-semibold text-slate-700">
            Este link não está mais disponível.
          </p>
          <p className="max-w-sm text-sm text-slate-400">
            O link pode ter expirado, sido revogado ou nunca ter existido. Solicite um novo link
            de acompanhamento à equipe responsável pelo atendimento.
          </p>
        </div>
      </PublicShell>
    );
  }

  const ticket = findTicketById(resolution.link.ticketId);
  if (!ticket) {
    return (
      <PublicShell>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShieldAlert size={28} className="text-slate-300" />
          <p className="text-base font-semibold text-slate-700">
            Este link não está mais disponível.
          </p>
        </div>
      </PublicShell>
    );
  }

  const pipeline = getTicketPipeline(ticket);
  const { text: summary } = truncate(ticket.firstInteractionSummary, 320);

  return (
    <PublicShell>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-indigo-700">
            Ticket #{ticket.id}
          </span>
          <TicketTypeBadge type={ticket.type} />
        </div>
        <h1 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">{ticket.title}</h1>

        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Status do Atendimento
          </p>
          <div className="mt-1">
            <MovideskStatusBadge status={ticket.movideskStatus} />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Resumo</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{summary}</p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {pipeline.developments.length > 1 || pipeline.developments[0].jiraKey
              ? "Desenvolvimentos relacionados"
              : "Pipeline"}
          </p>
          <div className="flex flex-col gap-6">
            {pipeline.developments.map((dev) => (
              <div key={dev.jiraKey ?? "attendance"}>
                <JiraPipeline development={dev} orientation="vertical" />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
          Última atualização: {formatDateTime(ticket.updatedAt)}
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Página pública de acompanhamento · nenhum login necessário
      </p>
    </PublicShell>
  );
}
