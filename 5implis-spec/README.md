# 5impl.is — Especificação Técnica Completa

> Versão: 1.0 · Stack: Paperclip + Directus + n8n + LiteLLM + Hermes · 41 Agentes

Esta especificação consolida o design completo do sistema de automação da **5impl.is** — desde a arquitetura multi-tenant até o catálogo de agentes, schemas de banco de dados, fluxos operacionais, integrações e scripts de provisionamento.

---

## Diagrama de Contexto (C4 — Nível 1)

```mermaid
C4Context
  title 5impl.is — Contexto do Sistema

  Person(socio, "Sócio / Fundador", "Aprova conteúdo, contratos e provisioning via HITL")
  Person(cliente_b2b, "Cliente B2B", "Contrata consultoria de automação")
  Person(lider_igreja, "Líder de Igreja", "Assina e usa a Church Platform SaaS")
  Person(lead, "Lead", "Capturado pelo funil via site, WhatsApp ou redes sociais")

  System(fiveimpl, "5impl.is", "41 agentes orquestrados no Paperclip — CRM, Editorial, Vendas, SaaS, Suporte e Financeiro")

  System_Ext(whatsapp, "WhatsApp Business", "Qualificação de leads, suporte e notificações")
  System_Ext(zernio, "Zernio", "Captura de leads e publicação em redes sociais")
  System_Ext(gateway, "Gateway Financeiro", "Assinaturas recorrentes e pagamentos avulsos")
  System_Ext(clicksign, "Clicksign / ZapSign", "Assinatura digital de contratos")
  System_Ext(cloudflare, "Cloudflare Pages", "Deploy do site estático Astro")
  System_Ext(coolify, "Coolify / Docker", "Provisionamento de instâncias Church Platform")
  System_Ext(llm_providers, "Anthropic / OpenAI", "Modelos LLM roteados pelo proxy LiteLLM")
  System_Ext(canva, "Canva API", "Assets visuais via templates (via n8n)")
  System_Ext(telegram, "Telegram", "Alertas P1 e relatórios para os sócios")

  Rel(socio, fiveimpl, "HITL: aprovações e decisões críticas")
  Rel(lead, fiveimpl, "Site, WhatsApp, Zernio")
  Rel(cliente_b2b, fiveimpl, "Contrato, workspace, entregáveis")
  Rel(lider_igreja, fiveimpl, "Assinatura, plataforma, suporte")
  Rel(fiveimpl, whatsapp, "Mensagens via Zernio adapter")
  Rel(fiveimpl, zernio, "Posts e webhooks de leads")
  Rel(fiveimpl, gateway, "Pagamentos e assinaturas")
  Rel(fiveimpl, clicksign, "Upload e assinatura de PDFs")
  Rel(fiveimpl, cloudflare, "Build webhook pós-publicação")
  Rel(fiveimpl, coolify, "Provisioning de instâncias")
  Rel(fiveimpl, llm_providers, "Chamadas LLM via LiteLLM")
  Rel(fiveimpl, canva, "Templates de imagem via n8n")
  Rel(fiveimpl, telegram, "Alertas e relatórios executivos")
```

---

## Índice de Navegação

### 01 — Arquitetura
| Documento | Descrição |
|---|---|
| [C1 — Contexto](./01-architecture/c1-context.md) | Atores, sistemas externos e fronteiras do sistema |
| [C2 — Containers](./01-architecture/c2-containers.md) | Componentes técnicos internos e comunicação |
| [Multi-Tenant](./01-architecture/multi-tenant.md) | Isolamento de workspaces e fronteiras de dados |

### 02 — Catálogo de Agentes
| Documento | Agentes |
|---|---|
| [Índice Geral](./02-agents/README.md) | Todos os 41 agentes — referência rápida |
| [Executivo](./02-agents/01-executive.md) | CEO, GovernanceAuditor |
| [Editorial & Marketing](./02-agents/02-editorial.md) | 15 agentes do pipeline de conteúdo |
| [Vendas & Leads](./02-agents/03-sales.md) | 8 agentes do funil comercial |
| [SaaS Church](./02-agents/04-saas-church.md) | 7 agentes do produto e customer success |
| [Suporte & Infra](./02-agents/05-support.md) | OnCallSupport, IncidentDispatcher, KnowledgeDocumenter |
| [Financeiro](./02-agents/06-financial.md) | 5 agentes de billing e governança de tokens |

### 03 — Schemas e Dados
| Documento | Conteúdo |
|---|---|
| [Visão Geral dos Schemas](./03-schemas/README.md) | Todas as coleções Directus com campos, tipos e relações |
| [Script Bootstrap](./03-schemas/bootstrap.ts) | Provisionamento automático de todas as coleções |

### 04 — Fluxos Operacionais
| Documento | Fluxo |
|---|---|
| [Pipeline de Conteúdo](./04-flows/01-content-pipeline.md) | Editorial → Aprovação → Publicação → Social → Newsletter |
| [Lead → Contrato](./04-flows/02-lead-to-contract.md) | Captura → Qualificação → Proposta → Assinatura |
| [Ciclo de Vida Church SaaS](./04-flows/03-church-lifecycle.md) | Subscrição → Onboarding → Retenção → Dunning → Offboarding |
| [Entrega de Consultoria](./04-flows/04-consulting-delivery.md) | Pós-assinatura → Provisionamento → Milestones → Invoice |
| [Billing & Tokens](./04-flows/05-financial-billing.md) | Quota → Gatekeepers → Aditivos → Relatório Financeiro |

### 05–08 — Operações e Configuração
| Documento | Conteúdo |
|---|---|
| [Integrações Externas](./05-integrations/README.md) | Spec de todas as APIs externas e padrões de integração |
| [Provisionamento de Workspace](./06-provisioning/README.md) | Setup completo de novo workspace de cliente |
| [Onboarding Church](./07-onboarding/church.md) | Sequência pós-ativação de assinatura SaaS |
| [Onboarding Consultoria](./07-onboarding/consulting.md) | Sequência pós-assinatura de contrato |
| [Parametrização via Directus](./08-parametrization/README.md) | Como agentes lêem configurações dinâmicas do banco |

---

## Princípios Arquiteturais

| Princípio | Definição |
|---|---|
| **SoC** | Cada agente tem exatamente uma responsabilidade |
| **Agente vs n8n** | Agentes para integrações que exigem inteligência contextual (via MCP/tools); n8n para fluxos com loops, branches complexos, retry em lote |
| **Times de Agentes** | Se um agente faz demais, componentiza em equipe especializada |
| **Multi-tenant** | Cada cliente tem workspace isolado: Paperclip + n8n + Directus + LiteLLM VKey + Hermes profile |
| **HITL Seletivo** | Autonomia total para operações de baixo risco; bloqueio humano para publicações, contratos e provisioning |
| **GitOps** | Documentação, schemas e specs versionados em Git |
| **DRY entre Agentes** | Payloads JSON curtos transferidos entre agentes; nunca repetir busca de dados já obtidos |
