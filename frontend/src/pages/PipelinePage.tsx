import { useMemo, useState } from "react";
import { MOCK_TICKETS } from "../data/mockTickets";
import { TicketFilters } from "../components/TicketFilters";
import { TicketTable } from "../components/TicketTable";
import { Pagination } from "../components/Pagination";
import { filterTickets } from "../services/ticketService";
import type { TicketFiltersState } from "../types/ticket";

const PAGE_SIZE = 12;

const INITIAL_FILTERS: TicketFiltersState = {
  search: "",
  ticketType: null,
  movideskStatus: null,
  pipelineStage: null,
  jiraPresence: "all",
};

export default function PipelinePage() {
  const [filters, setFilters] = useState<TicketFiltersState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterTickets(MOCK_TICKETS, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFiltersChange(next: TicketFiltersState) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Pipeline de Atendimento</h1>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe em qual etapa está cada atendimento, cruzando os tickets Movidesk com os
          respectivos desenvolvimentos no Jira.
        </p>
      </div>

      <TicketFilters value={filters} onChange={handleFiltersChange} resultCount={filtered.length} />

      <TicketTable tickets={pageItems} />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
