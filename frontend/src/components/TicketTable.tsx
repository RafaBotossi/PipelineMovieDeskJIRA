import type { Ticket } from "../types/ticket";
import { TicketRow } from "./TicketRow";
import { Inbox } from "lucide-react";

const HEADERS = [
  "Ticket",
  "Título",
  "Status do Atendimento",
  "Resumo da Primeira Interação",
  "Pipeline",
  "Atualização",
  "Ações",
];

export function TicketTable({
  tickets,
  onOpenShare,
}: {
  tickets: Ticket[];
  onOpenShare: (ticket: Ticket) => void;
}) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <Inbox size={28} className="text-slate-300" />
        <p className="text-sm font-medium text-slate-500">Nenhum ticket encontrado</p>
        <p className="text-xs text-slate-400">Ajuste a busca ou os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {HEADERS.map((header, i) => (
                <th
                  key={header}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    i === HEADERS.length - 1 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onOpenShare={onOpenShare} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
