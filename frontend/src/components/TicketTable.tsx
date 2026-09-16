import type { Ticket } from "../types/ticket";
import { TicketRow } from "./TicketRow";
import { Inbox } from "lucide-react";

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
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <TicketRow key={ticket.id} ticket={ticket} onOpenShare={onOpenShare} />
      ))}
    </div>
  );
}
