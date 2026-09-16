import { AlertTriangle } from "lucide-react";

/**
 * Só deve ser usado em telas internas (lista e detalhes do ticket). Nunca
 * renderizar isto na página pública de acompanhamento.
 */
export function InternalAlertBanner({ message }: { message: string }) {
  return (
    <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2.5">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" />
      <p className="text-xs leading-relaxed text-red-800">
        <span className="font-bold uppercase tracking-wide">Atenção! </span>
        {message}
      </p>
    </div>
  );
}
