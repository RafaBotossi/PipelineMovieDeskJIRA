import { useState } from "react";
import clsx from "clsx";
import { Copy, Link2 } from "lucide-react";
import { Modal } from "./Modal";
import { ShareLinkManager } from "./ShareLinkManager";
import { useShareLinks } from "../context/ShareLinksContext";
import { useToast } from "../context/ToastContext";
import {
  DEFAULT_EXPIRATION,
  EXPIRATION_LABELS,
  buildPublicUrl,
} from "../services/shareLinkService";
import type { ExpirationOption, Ticket } from "../types/ticket";

const OPTIONS: ExpirationOption[] = ["24h", "7d", "30d", "never"];

export function ShareTicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const { createShareLink } = useShareLinks();
  const showToast = useToast();
  const [expiration, setExpiration] = useState<ExpirationOption>(DEFAULT_EXPIRATION);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  function handleGenerate() {
    const link = createShareLink(ticket.id, expiration);
    setGeneratedUrl(buildPublicUrl(link.token));
  }

  async function handleCopy() {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
    } catch {
      // ambiente sem permissão de clipboard — link segue exibido na tela para cópia manual
    }
    showToast("Link copiado para a área de transferência");
  }

  return (
    <Modal title="Link de acompanhamento" onClose={onClose} widthClass="max-w-xl">
      <div className="mb-1 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
        <Link2 size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <p className="text-xs text-slate-500">
          Gera um link público e seguro para o ticket <strong>#{ticket.id}</strong>, sem
          necessidade de login. Quem acessar verá apenas o andamento deste atendimento.
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-slate-600">Expiração do link</p>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setExpiration(opt)}
              className={clsx(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                expiration === opt
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {EXPIRATION_LABELS[opt]}
              {opt === DEFAULT_EXPIRATION && (
                <span className="ml-1 text-[10px] text-slate-400">(padrão)</span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Link2 size={15} />
          Gerar link de acompanhamento
        </button>

        {generatedUrl && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-emerald-800">
              {generatedUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
            >
              <Copy size={12} />
              Copiar
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-slate-600">Links já gerados</p>
        <ShareLinkManager ticketId={ticket.id} />
      </div>
    </Modal>
  );
}
