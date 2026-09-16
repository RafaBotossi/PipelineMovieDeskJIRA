import { Ban, Copy } from "lucide-react";
import { useShareLinks } from "../context/ShareLinksContext";
import { useToast } from "../context/ToastContext";
import { StatusBadge } from "./StatusBadge";
import { buildPublicUrl, maskToken } from "../services/shareLinkService";
import { formatDateTime } from "../utils/format";
import type { ShareLink } from "../types/ticket";

function linkStatus(link: ShareLink): { label: string; tone: "success" | "neutral" | "danger" } {
  if (link.revokedAt) return { label: "Revogado", tone: "neutral" };
  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
    return { label: "Expirado", tone: "danger" };
  }
  return { label: "Ativo", tone: "success" };
}

export function ShareLinkManager({ ticketId }: { ticketId: number }) {
  const { getLinksForTicket, revokeShareLink } = useShareLinks();
  const showToast = useToast();
  const links = getLinksForTicket(ticketId);

  if (links.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
        Nenhum link gerado para este ticket ainda.
      </p>
    );
  }

  async function copyLink(token: string) {
    const url = buildPublicUrl(token);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ambiente sem permissão de clipboard — link permanece disponível para cópia manual
    }
    showToast("Link copiado para a área de transferência");
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200">
      {links.map((link) => {
        const status = linkStatus(link);
        return (
          <div key={link.id} className="flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-xs text-slate-600">
                /public/t/{maskToken(link.token)}
              </span>
              <StatusBadge label={status.label} tone={status.tone} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
              <span>Criado em {formatDateTime(link.createdAt)}</span>
              <span>
                {link.expiresAt ? `Expira em ${formatDateTime(link.expiresAt)}` : "Sem expiração"}
              </span>
              <span>{link.accessCount} acesso(s)</span>
              {link.lastAccessAt && <span>Último acesso {formatDateTime(link.lastAccessAt)}</span>}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => copyLink(link.token)}
                disabled={status.label !== "Ativo"}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Copy size={12} />
                Copiar link
              </button>
              {status.label === "Ativo" && (
                <button
                  type="button"
                  onClick={() => revokeShareLink(link.id)}
                  className="flex items-center gap-1.5 rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <Ban size={12} />
                  Revogar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
