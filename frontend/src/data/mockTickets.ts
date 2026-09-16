import type { JiraIssue, Ticket, TicketType } from "../types/ticket";

/**
 * Gerador determinístico de dados fictícios para o protótipo visual.
 *
 * IMPORTANTE: isto NÃO é uma integração. É uma fixture de desenvolvimento,
 * isolada em `src/data/`, para alimentar a interface enquanto não existem
 * `services/movidesk` e `services/jira` reais (ver spec.md, seção
 * "Regras importantes de implementação"). Nenhum dado aqui vem de um
 * Movidesk ou Jira reais.
 */

// Mulberry32 — RNG seedado, garante que os 100 tickets sejam sempre os mesmos.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260915);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

const MODULES = [
  "Faturamento",
  "NFS-e",
  "Financeiro",
  "Estoque",
  "Integração Bancária",
  "Portal do Cliente",
  "Relatórios Gerenciais",
  "Cadastro de Clientes",
  "Contas a Pagar",
  "Contas a Receber",
  "Importação de XML",
  "API de Integração",
  "Módulo Fiscal",
  "Emissão de Boletos",
  "Conciliação Bancária",
  "Dashboard Gerencial",
  "Módulo de Compras",
  "Central de Notificações",
  "Aplicativo Mobile",
  "Autenticação / SSO",
] as const;

const ACOES = [
  "emitir nota fiscal",
  "gerar boleto",
  "sincronizar dados",
  "importar arquivo XML",
  "consultar relatório",
  "processar pagamento",
  "atualizar cadastro",
  "exportar dados para Excel",
  "enviar e-mail de cobrança",
  "conciliar lançamentos bancários",
  "calcular impostos",
  "gerar relatório consolidado",
] as const;

const BUG_TEMPLATES = [
  (m: string, a: string) => `Erro ao ${a} em ${m}`,
  (m: string) => `${m} apresenta falha intermitente`,
  (m: string) => `Falha crítica em ${m}`,
  (m: string) => `Erro 500 ao acessar ${m}`,
  (m: string) => `${m} não carrega para alguns clientes`,
  (m: string) => `Divergência de valores em ${m}`,
  (m: string, a: string) => `Timeout ao ${a}`,
  (m: string) => `Duplicidade de registros em ${m}`,
  (m: string, a: string) => `Sistema trava ao ${a}`,
  (m: string) => `${m} retorna dados incorretos`,
] as const;

const MELHORIA_TEMPLATES = [
  (m: string) => `Adicionar filtro por período em ${m}`,
  (m: string) => `Solicitação de melhoria em ${m}`,
  (m: string) => `Permitir exportação em Excel em ${m}`,
  (m: string) => `Adicionar validação extra em ${m}`,
  (m: string) => `Otimizar performance de ${m}`,
  (m: string) => `Criar novo relatório para ${m}`,
  (m: string) => `Disponibilizar campo adicional em ${m}`,
  (m: string, a: string) => `Automatizar processo de ${a}`,
  (m: string) => `Revisar layout de ${m}`,
  (m: string) => `Incluir novo filtro avançado em ${m}`,
] as const;

const MOVIDESK_STATUSES = [
  "Novo",
  "Em Atendimento",
  "Aguardando Cliente",
  "Aguardando Terceiros",
  "Reaberto",
  "Em Análise",
  "Resolvido",
  "Fechado",
] as const;

const JIRA_STATUSES_KNOWN = [
  "Pendente",
  "Em Desenvolvimento",
  "Desenvolvido",
  "Revisão de Código",
  "Correções/Ajustes",
  "Liberar Release",
  "Em Teste",
  "Testar Release",
  "Concluído",
] as const;

// Propositalmente fora do mapeamento (config/pipelineConfig.ts) para exercitar
// o estado "Status Jira não mapeado" na interface.
const JIRA_STATUSES_UNMAPPED = [
  "Bloqueado",
  "Aguardando Aprovação do PO",
  "Em Homologação Externa",
] as const;

const JIRA_PREFIXES = ["DEV", "SUP", "INFRA", "APP"] as const;

const SUMMARY_OPENERS = [
  "Cliente relata que",
  "Usuário informou que",
  "Ao tentar utilizar o sistema, o cliente percebeu que",
  "Contato inicial via chat: o cliente descreveu que",
  "Solicitante abriu o chamado informando que",
  "Cliente entrou em contato via telefone relatando que",
] as const;

const SUMMARY_BODIES = [
  "o processo apresenta erro ao finalizar a operação, impedindo a continuidade do atendimento aos clientes finais",
  "os valores exibidos na tela não conferem com os valores esperados, gerando divergência no fechamento do período",
  "a tela trava e é necessário atualizar a página diversas vezes para conseguir concluir a tarefa",
  "recebe uma mensagem de erro genérica sem detalhes suficientes para identificar a causa",
  "o comportamento só ocorre para um subconjunto específico de clientes, o que dificulta a reprodução do problema",
  "a funcionalidade atual não atende mais ao volume de operações diárias da empresa",
  "seria importante ter mais flexibilidade para configurar o processo de acordo com a realidade de cada filial",
  "seria interessante existir um filtro adicional para facilitar a análise dos dados apresentados",
  "seria importante existir uma automação que evite o retrabalho manual realizado hoje pela equipe financeira",
] as const;

const SUMMARY_EXTRAS = [
  " Anexou prints demonstrando o comportamento relatado.",
  " Informou que o problema começou a ocorrer após a última atualização do sistema.",
  " Reforçou que a situação está impactando o fechamento mensal da empresa.",
  " Disponibilizou acesso remoto para reprodução do cenário pela equipe de suporte.",
  " Solicitou retorno com prioridade, pois o processo é utilizado diariamente pela equipe.",
  " Mencionou que outros usuários da mesma empresa relataram o mesmo comportamento.",
  "",
  "",
] as const;

const COMPANIES = [
  "Grupo Alfa Contabilidade",
  "Construtora Horizonte Ltda",
  "Distribuidora Santa Fé",
  "Comércio Boa Vista",
  "Indústria Nova Era",
  "Transportadora Rota Sul",
  "Farmácia Vida Plena",
  "Supermercados União",
  "Auto Peças Central",
  "Clínica Bem Estar",
  "Escritório Modelo Contábil",
  "Agropecuária Campo Verde",
] as const;

const FIRST_NAMES = [
  "Mariana",
  "João",
  "Ana",
  "Carlos",
  "Fernanda",
  "Rodrigo",
  "Patrícia",
  "Bruno",
  "Camila",
  "Eduardo",
  "Larissa",
  "Rafael",
  "Juliana",
  "Marcos",
] as const;

const LAST_NAMES = [
  "Costa",
  "Pereira",
  "Souza",
  "Oliveira",
  "Almeida",
  "Ribeiro",
  "Carvalho",
  "Gomes",
  "Barbosa",
  "Rocha",
] as const;

function buildTitle(type: TicketType, mod: string, acao: string): string {
  const templates = type === "bug" ? BUG_TEMPLATES : MELHORIA_TEMPLATES;
  const template = pick(templates);
  return template(mod, acao);
}

function buildSummary(): string {
  const opener = pick(SUMMARY_OPENERS);
  const body = pick(SUMMARY_BODIES);
  const extra = pick(SUMMARY_EXTRAS);
  const secondBody = rng() > 0.5 ? ` Além disso, ${pick(SUMMARY_BODIES)}.` : "";
  return `${opener} ${body}.${secondBody}${extra}`;
}

function buildRequester(): string | null {
  if (rng() < 0.08) return null;
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const company = pick(COMPANIES);
  return `${name} — ${company}`;
}

function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, randomInt(0, 59), 0, 0);
  return d.toISOString();
}

function buildJiraIssues(mod: string): JiraIssue[] {
  const roll = rng();
  let count: number;
  if (roll < 0.35) count = 0;
  else if (roll < 0.7) count = 1;
  else if (roll < 0.9) count = 2;
  else count = 3;

  const issues: JiraIssue[] = [];
  for (let i = 0; i < count; i++) {
    const unmapped = rng() < 0.1;
    const status = unmapped ? pick(JIRA_STATUSES_UNMAPPED) : pick(JIRA_STATUSES_KNOWN);
    const prefix = pick(JIRA_PREFIXES);
    const number = randomInt(100, 999);
    issues.push({
      key: `${prefix}-${number}`,
      title: `[${prefix}] ${buildTitle(rng() > 0.5 ? "bug" : "melhoria", mod, pick(ACOES))}`,
      status,
      updatedAt: daysAgo(randomInt(0, 20), randomInt(0, 23)),
    });
  }
  return issues;
}

function buildTicket(index: number): Ticket {
  const type: TicketType = rng() > 0.55 ? "bug" : "melhoria";
  const mod = pick(MODULES);
  const acao = pick(ACOES);
  const createdDaysAgo = randomInt(1, 90);
  const createdAt = daysAgo(createdDaysAgo, randomInt(0, 23));
  const jiraIssues = buildJiraIssues(mod);

  const latestJiraUpdate = jiraIssues.reduce<string | null>((latest, issue) => {
    if (!latest || issue.updatedAt > latest) return issue.updatedAt;
    return latest;
  }, null);

  const ownUpdatedAt = daysAgo(randomInt(0, Math.min(createdDaysAgo, 20)), randomInt(0, 23));
  const updatedAt =
    latestJiraUpdate && latestJiraUpdate > ownUpdatedAt ? latestJiraUpdate : ownUpdatedAt;

  return {
    id: 100000 + index,
    title: buildTitle(type, mod, acao),
    type,
    movideskStatus: pick(MOVIDESK_STATUSES),
    firstInteractionSummary: buildSummary(),
    requester: buildRequester(),
    createdAt,
    updatedAt,
    jiraIssues,
  };
}

function generateTickets(total: number): Ticket[] {
  const tickets: Ticket[] = [];
  for (let i = 1; i <= total; i++) {
    tickets.push(buildTicket(i));
  }
  return tickets.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export const MOCK_TICKETS: Ticket[] = generateTickets(100);

export function findTicketById(id: number): Ticket | undefined {
  return MOCK_TICKETS.find((t) => t.id === id);
}

export const ALL_MOVIDESK_STATUSES = MOVIDESK_STATUSES;
