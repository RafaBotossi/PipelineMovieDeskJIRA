import type { ExpirationOption } from "../types/ticket";

/**
 * Regras de geração de token e expiração para links de acompanhamento
 * público. Em produção este código roda no backend (ver spec.md — nunca
 * usar ID sequencial, hash simples ou base64 do ID como token). Aqui, para
 * fins do protótipo visual, replicamos a mesma regra no cliente.
 */
export function generateSecureToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function computeExpiresAt(option: ExpirationOption, from: Date = new Date()): string | null {
  const date = new Date(from);
  switch (option) {
    case "24h":
      date.setHours(date.getHours() + 24);
      return date.toISOString();
    case "7d":
      date.setDate(date.getDate() + 7);
      return date.toISOString();
    case "30d":
      date.setDate(date.getDate() + 30);
      return date.toISOString();
    case "never":
      return null;
  }
}

export const EXPIRATION_LABELS: Record<ExpirationOption, string> = {
  "24h": "24 horas",
  "7d": "7 dias",
  "30d": "30 dias",
  never: "Sem expiração",
};

export const DEFAULT_EXPIRATION: ExpirationOption = "30d";

export function maskToken(token: string): string {
  if (token.length <= 12) return token;
  return `${token.slice(0, 6)}…${token.slice(-4)}`;
}

export function buildPublicUrl(token: string): string {
  return `${window.location.origin}/public/t/${token}`;
}
