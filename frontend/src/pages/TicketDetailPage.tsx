import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Link2 } from "lucide-react";
import { findTicketById } from "../data/mockTickets";
import { getTicketPipeline } from "../services/pipelineService";
import { MovideskStatusBadge, StatusBadge, TicketTypeBadge } from "../components/StatusBadge";
import { PIPELINE_STAGE_LABEL } from "../config/pipelineConfig";
import { JiraPipeline } from "../components/JiraPipeline";
import { ShareTicketModal } from "../components/ShareTicketModal";
import { ShareLinkManager } from "../components/ShareLinkManager";
import { formatDate, formatDateTime } from "../utils/format";
import type { PipelineStage } from "../types/ticket";

const STAGE_TONE: Record<PipelineStage, "info" | "progress" | "warning" | "success" | "danger"> = {
  attendance: "info",
  development: "progress",
  testing: "warning",
  delivery: "success",
  unmapped: "danger",
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800">{value}</p>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const ticket = id ? findTicketById(Number(id)) : undefined;
  const [shareOpen, setShareOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-lg font-semibold text-slate-700">Ticket não encontrado</p>
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
          Voltar para o pipeline
        </Link>
      </div>
    );
  }

  const pipeline = getTicketPipeline(ticket);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={15} />
          Voltar ao Pipeline de Atendimento
        </Link>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-indigo-700">
                #{ticket.id}
              </span>
              <TicketTypeBadge type={ticket.type} />
            </div>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">{ticket.title}</h1>
          </div>

          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Link2 size={15} />
            Gerar link de acompanhamento
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Informações Movidesk</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <InfoField label="ID" value={`#${ticket.id}`} />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Status
            </p>
            <div className="mt-1">
              <MovideskStatusBadge status={ticket.movideskStatus} />
            </div>
          </div>
          <InfoField label="Data de abertura" value={formatDate(ticket.createdAt)} />
          <InfoField label="Última atualização" value={formatDateTime(ticket.updatedAt)} />
          <InfoField label="Solicitante" value={ticket.requester ?? "Não informado"} />
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Primeira interação
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {ticket.firstInteractionSummary}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Desenvolvimentos relacionados</h2>

        {pipeline.developments.length === 1 && pipeline.developments[0].jiraKey === null ? (
          <div>
            <p className="mb-3 text-xs text-slate-400">
              Este ticket ainda não possui um ticket Jira associado.
            </p>
            <JiraPipeline development={pipeline.developments[0]} size="lg" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pipeline.developments.map((dev) => (
              <div key={dev.jiraKey} className="rounded-lg border border-slate-100 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{dev.name}</p>
                    <p className="text-xs text-slate-500">{dev.jiraTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
                      {dev.jiraKey}
                    </span>
                    <StatusBadge
                      label={PIPELINE_STAGE_LABEL[dev.pipelineStage]}
                      tone={STAGE_TONE[dev.pipelineStage]}
                    />
                  </div>
                </div>
                <JiraPipeline development={dev} size="lg" />
                <p className="mt-3 text-[11px] text-slate-400">
                  Status Jira: {dev.jiraStatus} · Última atualização{" "}
                  {formatDateTime(dev.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Links de acompanhamento</h2>
        <ShareLinkManager ticketId={ticket.id} />
      </section>

      {shareOpen && <ShareTicketModal ticket={ticket} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
