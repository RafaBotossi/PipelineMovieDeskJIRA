import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExpirationOption, ShareLink } from "../types/ticket";
import { computeExpiresAt, generateSecureToken } from "../services/shareLinkService";

const STORAGE_KEY = "pipeline-prototype:share-links";

export type TokenResolution =
  | { status: "ok"; link: ShareLink }
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "revoked" };

interface ShareLinksContextValue {
  links: ShareLink[];
  getLinksForTicket: (ticketId: number) => ShareLink[];
  createShareLink: (ticketId: number, expiration: ExpirationOption) => ShareLink;
  revokeShareLink: (id: string) => void;
  resolveToken: (token: string) => TokenResolution;
  registerAccess: (token: string) => void;
}

const ShareLinksContext = createContext<ShareLinksContextValue | null>(null);

function loadInitial(): ShareLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ShareLink[];
  } catch {
    return [];
  }
}

export function ShareLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<ShareLink[]>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch {
      // localStorage indisponível (ex.: modo privado) — protótipo segue apenas em memória.
    }
  }, [links]);

  const getLinksForTicket = useCallback(
    (ticketId: number) => links.filter((l) => l.ticketId === ticketId),
    [links]
  );

  const createShareLink = useCallback((ticketId: number, expiration: ExpirationOption) => {
    const now = new Date();
    const link: ShareLink = {
      id: crypto.randomUUID(),
      ticketId,
      token: generateSecureToken(),
      createdBy: "rafael.botossi@inventsoftware.com.br",
      createdAt: now.toISOString(),
      expiresAt: computeExpiresAt(expiration, now),
      revokedAt: null,
      lastAccessAt: null,
      accessCount: 0,
    };
    setLinks((prev) => [link, ...prev]);
    return link;
  }, []);

  const revokeShareLink = useCallback((id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, revokedAt: new Date().toISOString() } : l))
    );
  }, []);

  const resolveToken = useCallback(
    (token: string): TokenResolution => {
      const link = links.find((l) => l.token === token);
      if (!link) return { status: "not_found" };
      if (link.revokedAt) return { status: "revoked" };
      if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
        return { status: "expired" };
      }
      return { status: "ok", link };
    },
    [links]
  );

  const registerAccess = useCallback((token: string) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.token === token
          ? { ...l, accessCount: l.accessCount + 1, lastAccessAt: new Date().toISOString() }
          : l
      )
    );
  }, []);

  const value = useMemo<ShareLinksContextValue>(
    () => ({
      links,
      getLinksForTicket,
      createShareLink,
      revokeShareLink,
      resolveToken,
      registerAccess,
    }),
    [links, getLinksForTicket, createShareLink, revokeShareLink, resolveToken, registerAccess]
  );

  return <ShareLinksContext.Provider value={value}>{children}</ShareLinksContext.Provider>;
}

export function useShareLinks() {
  const ctx = useContext(ShareLinksContext);
  if (!ctx) throw new Error("useShareLinks deve ser usado dentro de ShareLinksProvider");
  return ctx;
}
