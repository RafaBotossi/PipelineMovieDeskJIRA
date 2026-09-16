import { type ReactNode } from "react";

export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1.5 text-center text-[11px] leading-snug text-white opacity-0 shadow-lg transition-opacity duration-100 group-hover/tooltip:opacity-100"
      >
        {content}
        <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900" />
      </span>
    </span>
  );
}
