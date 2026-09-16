import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Workflow, FlaskConical } from "lucide-react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Workflow size={18} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold text-slate-900">Pipeline de Atendimento</p>
              <p className="text-xs text-slate-500">Movidesk + Jira</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 sm:flex">
              <FlaskConical size={13} />
              Protótipo visual · dados fictícios
            </span>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
                RB
              </span>
              <span className="text-sm font-medium text-slate-700">Rafael Botossi</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Protótipo visual — sem conexão real com Movidesk ou Jira. Dados gerados para demonstração.
      </footer>
    </div>
  );
}
