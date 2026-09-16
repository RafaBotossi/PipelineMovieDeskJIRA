
Crie uma aplicação web completa utilizando:

* Frontend: React + TypeScript + Vite
* Backend: FastAPI + Python
* Banco de dados: PostgreSQL
* ORM: SQLAlchemy
* Autenticação: JWT ou sessão segura com cookies HttpOnly
* Integrações:

  * Movidesk API
  * Jira Cloud REST API
* Interface responsiva para desktop e tablet
* Arquitetura preparada para evolução futura

# Objetivo do sistema

Criar um portal para acompanhamento do pipeline de atendimento de tickets.

O sistema deve integrar tickets do Movidesk com tickets relacionados do Jira e apresentar, de maneira simples, em qual etapa cada atendimento está.

O portal será utilizado de duas formas:

1. Internamente, por usuários autenticados.
2. Externamente, por clientes ou pessoas sem acesso ao sistema, através de um link seguro gerado especificamente para acompanhamento de determinado ticket.

O sistema não será responsável por editar tickets no Movidesk ou Jira neste primeiro momento.

Ele será principalmente um portal de consulta e acompanhamento.

---

# Login

Criar autenticação de usuários.

Tela de login contendo:

* E-mail
* Senha
* Entrar
* Logout

Criar estrutura preparada para níveis de acesso futuramente.

Inicialmente considerar:

* ADMIN
* USER

ADMIN poderá futuramente acessar configurações.

USER poderá visualizar os tickets.

As senhas devem ser armazenadas utilizando hash seguro.

Nunca armazenar senha em texto puro.

---

# Tela principal

Após o login, apresentar uma tela chamada:

"Pipeline de Atendimento"

A tela deverá listar os tickets vindos do Movidesk.

Criar tabela com as seguintes colunas:

* Ticket
* Título
* Status do Atendimento
* Resumo da Primeira Interação
* Pipeline
* Atualização
* Ações

Onde:

Ticket:
Número/ID do ticket Movidesk.

Título:
Título do ticket no Movidesk.

Status do Atendimento:
Status atual do ticket no Movidesk.

Resumo da Primeira Interação:
Resumo do texto da primeira interação registrada no ticket Movidesk.

Não mostrar o texto completo caso seja muito grande.

Mostrar aproximadamente 150 a 250 caracteres e permitir expandir ou abrir detalhes.

Pipeline:
Exibir visualmente o estágio atual considerando Movidesk + Jira.

Atualização:
Data/hora da última sincronização ou última alteração conhecida.

Ações:
Menu contendo inicialmente:

* Visualizar
* Gerar link de acompanhamento
* Copiar link de acompanhamento

---

# Pipeline

Criar visualização horizontal do pipeline:

[ Em Atendimento ] → [ Em Desenvolvimento ] → [ Em Testes ] → [ Em Entrega ]

Utilizar aparência semelhante a stepper/timeline.

Exemplo:

✓ Em Atendimento
✓ Em Desenvolvimento
● Em Testes
○ Em Entrega

Estados:

* concluído
* atual
* futuro

A etapa atual deve possuir destaque visual.

---

# Regras padrão de pipeline

O pipeline deve ser calculado utilizando o ticket do Movidesk e os tickets Jira relacionados.

## Em Atendimento

Utilizar quando:

O ticket Movidesk ainda NÃO possui ticket Jira informado.

Exemplo:

Movidesk #12345

Pipeline:

Em Atendimento

---

# Em Desenvolvimento

Os seguintes status Jira devem, inicialmente, corresponder à etapa:

Em Desenvolvimento

Status Jira:

* Pendente
* Em Desenvolvimento
* Desenvolvido

---

# Em Testes

Os seguintes status Jira devem, inicialmente, corresponder à etapa:

Em Testes

Status Jira:

* Revisão de Código
* Correções/Ajustes
* Liberar Release
* Em Teste
* Testar Release

---

# Em Entrega

Os seguintes status Jira devem, inicialmente, corresponder à etapa:

Em Entrega

Status Jira:

* Concluído

---

# IMPORTANTE: configuração dos status

NÃO deixar esse mapeamento hardcoded na regra de negócio.

Criar configuração onde seja possível determinar:

STATUS JIRA → ETAPA DO PIPELINE

Exemplo de configuração:

{
"Pendente": "development",
"Em Desenvolvimento": "development",
"Desenvolvido": "development",

"Revisão de Código": "testing",
"Correções/Ajustes": "testing",
"Liberar Release": "testing",
"Em Teste": "testing",
"Testar Release": "testing",

"Concluído": "delivery"
}

Essa configuração deverá inicialmente poder ficar em arquivo de configuração.

Preferencialmente:

config/pipeline.yaml

Exemplo:

pipeline:

atendimento:
jira_status: []

desenvolvimento:
jira_status:
- Pendente
- Em Desenvolvimento
- Desenvolvido

testes:
jira_status:
- Revisão de Código
- Correções/Ajustes
- Liberar Release
- Em Teste
- Testar Release

entrega:
jira_status:
- Concluído

A arquitetura deve permitir que futuramente essa configuração seja administrada pela interface.

---

# Relação Movidesk → Jira

O ticket Movidesk poderá conter:

* nenhum ticket Jira
* um ticket Jira
* vários tickets Jira

Criar uma camada específica responsável por identificar os tickets Jira associados ao ticket Movidesk.

Não espalhar essa lógica pelo código.

Criar algo semelhante a:

MovideskJiraResolver

ou

TicketRelationService

Essa camada deverá receber um ticket Movidesk e retornar:

[
{
"jira_key": "DEV-123",
"jira_status": "Em Desenvolvimento"
}
]

ou:

[
{
"jira_key": "DEV-123",
"jira_status": "Em Teste"
},
{
"jira_key": "DEV-456",
"jira_status": "Pendente"
}
]

---

# Vários tickets Jira

Caso um ticket Movidesk possua mais de um ticket Jira associado, exibir uma linha de pipeline para cada desenvolvimento.

Exemplo:

Ticket Movidesk:

#12345
Erro na emissão de NFS-e

Tickets Jira:

DEV-123
Status: Em Teste

DEV-456
Status: Em Desenvolvimento

Exibir:

Desenvolvimento 1
DEV-123

[✓ Atendimento] → [✓ Desenvolvimento] → [● Testes] → [○ Entrega]

Desenvolvimento 2
DEV-456

[✓ Atendimento] → [● Desenvolvimento] → [○ Testes] → [○ Entrega]

Portanto:

1 Jira:
"Desenvolvimento"

2 Jiras:
"Desenvolvimento 1"
"Desenvolvimento 2"

3 Jiras:
"Desenvolvimento 1"
"Desenvolvimento 2"
"Desenvolvimento 3"

e assim sucessivamente.

Exibir também a chave do Jira associada a cada linha.

---

# Ticket sem Jira

Caso não exista ticket Jira associado:

Exibir apenas:

[● Em Atendimento] → [○ Em Desenvolvimento] → [○ Em Testes] → [○ Em Entrega]

Não gerar uma linha fictícia de desenvolvimento.

---

# Tela de detalhes

Ao clicar em um ticket, abrir tela de detalhes contendo:

## Informações Movidesk

* ID
* Título
* Status
* Data de abertura
* Última atualização
* Primeira interação
* Solicitante, caso disponível e permitido

## Desenvolvimentos relacionados

Para cada ticket Jira:

* Jira Key
* Título Jira
* Status Jira
* Pipeline correspondente
* Última atualização

Exibir uma timeline/stepper independente para cada Jira.

---

# Busca e filtros

Na tela principal adicionar:

Busca por:

* número do ticket Movidesk
* título
* ticket Jira

Filtros:

* Status Movidesk
* Etapa do Pipeline
* Possui Jira
* Sem Jira

Permitir combinar filtros.

---

# Compartilhamento público

Na coluna:

Ações

adicionar opção:

"Gerar link de acompanhamento"

Esse recurso deve gerar um link que permita alguém SEM LOGIN acompanhar somente aquele ticket.

Exemplo conceitual:

https://pipeline.empresa.com.br/public/t/<TOKEN>

IMPORTANTE:

NÃO utilizar diretamente:

/ticket/12345

ou:

?ticket=12345

O usuário externo não poderá trocar um número na URL e acessar outro ticket.

---

# Token de compartilhamento

Ao gerar o link, criar token criptograficamente seguro.

Utilizar algo semelhante a:

secrets.token_urlsafe(32)

ou tecnologia equivalente.

Exemplo:

/public/t/kY7Q3kF8jD9sUa83Xk3mP6...

O token deve ser aleatório e não previsível.

Nunca usar:

* ID sequencial
* hash simples do ticket
* base64 do ID
* número Movidesk
* número Jira

como mecanismo de segurança.

---

# Persistência dos links

Criar tabela:

ticket_share_links

Campos sugeridos:

id
ticket_id
token_hash
created_by
created_at
expires_at
revoked_at
last_access_at
access_count

NÃO armazenar obrigatoriamente o token puro.

Preferencialmente armazenar hash do token.

O token puro será apresentado apenas quando criado.

---

# Segurança do compartilhamento

O link público deverá:

* permitir acesso apenas ao ticket associado
* não permitir enumeração de tickets
* não expor endpoints internos
* não retornar dados de outros tickets
* validar token no backend
* usar rate limit
* registrar acessos

Caso token seja:

* inexistente
* expirado
* revogado

retornar página:

"Este link não está mais disponível."

Não informar se existe outro ticket com aquele ID.

---

# Expiração

Ao gerar link permitir selecionar:

* 24 horas
* 7 dias
* 30 dias
* Sem expiração

Configuração padrão:

30 dias.

---

# Revogação

Permitir ao usuário interno:

* visualizar links gerados
* copiar link
* revogar link
* gerar novo link

Um link revogado deve deixar de funcionar imediatamente.

---

# Página pública

Criar página pública simplificada.

Não mostrar informações administrativas.

Exibir somente:

Título do atendimento

Status do Atendimento

Resumo

Pipeline

Desenvolvimentos relacionados

Última atualização

Exemplo:

Ticket #12345

Problema ao emitir NFS-e

Status do Atendimento:
Em andamento

Desenvolvimento 1
DEV-123

[✓ Atendimento]
↓
[✓ Desenvolvimento]
↓
[● Testes]
↓
[○ Entrega]

Última atualização:
15/09/2026 14:32

Evitar expor informações internas desnecessárias do Jira.

---

# Sincronização Movidesk

Criar integração isolada:

services/movidesk/

Exemplo:

movidesk_client.py
movidesk_service.py
movidesk_mapper.py

Nunca chamar diretamente a API Movidesk dentro das rotas FastAPI.

Criar client dedicado.

Variáveis:

MOVIDESK_BASE_URL
MOVIDESK_TOKEN

Nunca colocar token no frontend.

---

# Sincronização Jira

Criar integração isolada:

services/jira/

Exemplo:

jira_client.py
jira_service.py
jira_mapper.py

Configuração:

JIRA_BASE_URL
JIRA_EMAIL
JIRA_API_TOKEN

Nunca enviar essas credenciais ao frontend.

---

# Cache / persistência

Evitar consultar Movidesk e Jira para cada abertura de página.

Criar persistência local dos dados relevantes.

Sugestão de entidades:

users

tickets

jira_issues

ticket_jira_relations

ticket_share_links

sync_runs

Pipeline sugerido:

Movidesk
↓
Sync Service
↓
PostgreSQL
↓
API FastAPI
↓
React

E:

Jira
↓
Sync Service
↓
PostgreSQL

A interface deve consultar preferencialmente o banco local.

---

# Atualização

Criar mecanismo de sincronização periódica.

Inicialmente:

a cada 5 minutos.

Permitir configuração:

SYNC_INTERVAL_MINUTES=5

Criar endpoint administrativo opcional:

POST /api/admin/sync

para forçar sincronização manual.

Não bloquear requisições de usuário enquanto sincronização ocorre.

---

# API

Criar endpoints aproximadamente assim:

POST
/api/auth/login

POST
/api/auth/logout

GET
/api/tickets

GET
/api/tickets/{id}

GET
/api/tickets/{id}/pipeline

POST
/api/tickets/{id}/share

GET
/api/tickets/{id}/shares

DELETE
/api/tickets/{id}/shares/{share_id}

GET
/public/t/{token}

POST
/api/admin/sync

Não expor APIs Movidesk/Jira diretamente ao navegador.

---

# Estrutura de backend

Separar:

routers
services
repositories
models
schemas
integrations
security
config

Exemplo:

backend/

app/
main.py

api/
auth.py
tickets.py
sharing.py
admin.py

core/
config.py
security.py

models/
user.py
ticket.py
jira_issue.py
ticket_share_link.py

schemas/

repositories/

services/
ticket_service.py
pipeline_service.py
sharing_service.py

integrations/
movidesk/
jira/

config/
pipeline.yaml

---

# Estrutura frontend

frontend/

src/

components/
pages/
services/
hooks/
types/
layouts/

Criar componentes reutilizáveis:

TicketTable

TicketRow

PipelineStepper

JiraPipeline

TicketFilters

ShareTicketModal

ShareLinkManager

TicketDetails

StatusBadge

---

# Interface

Criar visual moderno de sistema corporativo SaaS.

Priorizar:

* clareza
* legibilidade
* poucos elementos visuais desnecessários
* boa densidade de informação
* responsividade

Utilizar:

cards
badges
tooltips
stepper
tabelas
modais

Pipeline deve ser o principal elemento visual.

Evitar aparência de dashboard genérico cheio de gráficos.

---

# Estado visual sugerido

Pipeline:

Concluído:
check

Atual:
círculo preenchido

Futuro:
círculo vazio

Exemplo:

✓ Atendimento ━━━ ✓ Desenvolvimento ━━━ ● Testes ━━━ ○ Entrega

Mostrar tooltip ao passar o mouse:

"Jira: DEV-123"
"Status Jira: Em Teste"

---

# Tratamento de status desconhecido

Caso Jira retorne um status que não esteja configurado no pipeline:

NÃO assumir automaticamente uma etapa.

Exibir:

"Status Jira não mapeado"

Registrar log contendo:

Jira
Status recebido
Ticket Movidesk

Isso será importante para identificar novos workflows do Jira.

---

# Logs

Criar logs estruturados para:

login
falha de login
sincronização
erro Movidesk
erro Jira
status Jira desconhecido
criação de link público
revogação de link público
acesso por link público

Nunca logar:

senha
JWT
token Movidesk
token Jira
token público completo

---

# Arquivo .env.example

Criar:

DATABASE_URL=

JWT_SECRET=

MOVIDESK_BASE_URL=
MOVIDESK_TOKEN=

JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=

SYNC_INTERVAL_MINUTES=5

PUBLIC_URL=

Nunca versionar .env real.

---

# Docker

Mesmo que inicialmente o projeto possa rodar diretamente, deixar preparado para containerização futura.

Não tornar Docker obrigatório para desenvolvimento.

---

# Testes

Criar testes principalmente para:

PipelineService

Casos:

Movidesk sem Jira
→ Atendimento

Jira Pendente
→ Desenvolvimento

Jira Em Desenvolvimento
→ Desenvolvimento

Jira Revisão de Código
→ Testes

Jira Em Teste
→ Testes

Jira Concluído
→ Entrega

Jira desconhecido
→ status não mapeado

Movidesk com 2 Jiras
→ gera 2 pipelines independentes

Testar também:

token público válido
token inválido
token expirado
token revogado

---

# Documentação

Criar:

README.md

AGENTS.md

PROJETO.md

ARQUITETURA.md

CONFIGURACAO.md

README deve explicar como executar frontend e backend.

PROJETO.md deve explicar:

* objetivo
* regras de negócio
* relação Movidesk/Jira
* pipeline
* compartilhamento externo

ARQUITETURA.md deve explicar:

Movidesk
↓
Sync
↓
PostgreSQL
↑
Sync
↑
Jira

```
    ↓

 FastAPI

    ↓

  React
```

E fluxo público:

Usuário interno
↓
Gerar link
↓
Token aleatório seguro
↓
ticket_share_links
↓
/public/t/<token>
↓
Somente aquele ticket

---

# Regras importantes de implementação

Não criar mocks definitivos das integrações.

Pode criar fixtures para desenvolvimento, mas separar claramente dados mockados de integração real.

Não colocar regras de pipeline dentro dos componentes React.

Toda regra de determinação de pipeline deve ficar no backend.

Frontend deve apenas receber algo semelhante a:

{
"ticket_id": 12345,
"developments": [
{
"name": "Desenvolvimento 1",
"jira_key": "DEV-123",
"jira_status": "Em Teste",
"pipeline_stage": "testing"
},
{
"name": "Desenvolvimento 2",
"jira_key": "DEV-456",
"jira_status": "Pendente",
"pipeline_stage": "development"
}
]
}

Manter:

regra de negócio no backend
visualização no frontend

Priorizar código limpo, modular e fácil de manter.

Antes de implementar integrações reais, identificar exatamente:

1. Em qual campo do Movidesk está armazenada a referência do Jira.
2. Qual formato esse campo utiliza quando existem vários Jira.
3. Quais workflows/status reais existem no Jira.

Criar essas partes de forma configurável para evitar dependência forte do workflow atual.
