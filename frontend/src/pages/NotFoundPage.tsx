import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <p className="text-lg font-semibold text-slate-700">Página não encontrada</p>
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
        Voltar ao Pipeline de Atendimento
      </Link>
    </div>
  );
}
