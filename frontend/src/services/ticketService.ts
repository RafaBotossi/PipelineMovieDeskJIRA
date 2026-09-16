import type { Ticket, TicketFiltersState } from "../types/ticket";
import { getSummaryStage, getTicketPipeline } from "./pipelineService";

export function filterTickets(tickets: Ticket[], filters: TicketFiltersState): Ticket[] {
  const search = filters.search.trim().toLowerCase();

  return tickets.filter((ticket) => {
    if (search) {
      const matchesId = String(ticket.id).includes(search);
      const matchesTitle = ticket.title.toLowerCase().includes(search);
      const matchesJira = ticket.jiraIssues.some((issue) =>
        issue.key.toLowerCase().includes(search)
      );
      if (!matchesId && !matchesTitle && !matchesJira) return false;
    }

    if (filters.movideskStatus && ticket.movideskStatus !== filters.movideskStatus) {
      return false;
    }

    if (filters.jiraPresence === "with" && ticket.jiraIssues.length === 0) return false;
    if (filters.jiraPresence === "without" && ticket.jiraIssues.length > 0) return false;

    if (filters.pipelineStage) {
      const pipeline = getTicketPipeline(ticket);
      const summaryStage = getSummaryStage(pipeline);
      if (summaryStage !== filters.pipelineStage) return false;
    }

    return true;
  });
}
