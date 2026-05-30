# Catálogo de Agentes — Referência Rápida

> 41 agentes · 7 departamentos · Todos rodam no Paperclip

---

## Índice por Departamento

| # | agent_id | Departamento | Trigger | Arquivo |
|---|---|---|---|---|
| 1 | `ceo` | Executivo | Issue no backlog / `system_alert_triggered` | [01-executive.md](./01-executive.md) |
| 2 | `governance_auditor` | Executivo | Cron Seg 01:00 / `schema_changed` | [01-executive.md](./01-executive.md) |
| 3 | `editorial_planner` | Editorial | Cron dia 1 de cada mês 07:00 | [02-editorial.md](./02-editorial.md) |
| 4 | `market_researcher` | Editorial | `editorial_schedule_triggered` | [02-editorial.md](./02-editorial.md) |
| 5 | `content_writer` | Editorial | `research_completed` | [02-editorial.md](./02-editorial.md) |
| 6 | `seo_specialist` | Editorial | `article_written` | [02-editorial.md](./02-editorial.md) |
| 7 | `draft_publisher` | Editorial | `article_seo_ready` | [02-editorial.md](./02-editorial.md) |
| 8 | `image_director` | Editorial | `draft_created` / `social_assets_needed` | [02-editorial.md](./02-editorial.md) |
| 9 | `editorial_gatekeeper` | Editorial | `draft_created` / `social_post_drafted` | [02-editorial.md](./02-editorial.md) |
| 10 | `static_site_publisher` | Editorial | `content_approved` | [02-editorial.md](./02-editorial.md) |
| 11 | `social_media_strategist` | Editorial | `content_published` / issue `social_campaign` | [02-editorial.md](./02-editorial.md) |
| 12 | `linkedin_copywriter` | Editorial | Delegado pelo `social_media_strategist` | [02-editorial.md](./02-editorial.md) |
| 13 | `instagram_copywriter` | Editorial | Delegado pelo `social_media_strategist` | [02-editorial.md](./02-editorial.md) |
| 14 | `newsletter_editor` | Editorial | `content_published` | [02-editorial.md](./02-editorial.md) |
| 15 | `newsletter_dispatcher` | Editorial | `newsletter_ready` | [02-editorial.md](./02-editorial.md) |
| 16 | `social_media_publisher` | Editorial | `social_approved` | [02-editorial.md](./02-editorial.md) |
| 17 | `content_analyst` | Editorial | Cron Segunda 08:00 | [02-editorial.md](./02-editorial.md) |
| 18 | `waitlist_ingester` | Vendas | Webhook POST do site | [03-sales.md](./03-sales.md) |
| 19 | `lead_nurturer` | Vendas | Cron diário 08:00 / `lead_status_changed` | [03-sales.md](./03-sales.md) |
| 20 | `lead_capturer` | Vendas | Webhook Zernio | [03-sales.md](./03-sales.md) |
| 21 | `capacity_monitor` | Vendas | `issue_status_changed` / Cron 30min | [03-sales.md](./03-sales.md) |
| 22 | `sales_qualifier` | Vendas | `raw_lead_captured` / WhatsApp inbound | [03-sales.md](./03-sales.md) |
| 23 | `proposal_architect` | Vendas | `lead_qualified` | [03-sales.md](./03-sales.md) |
| 24 | `contract_compiler` | Vendas | `proposal_drafted` | [03-sales.md](./03-sales.md) |
| 25 | `signature_orchestrator` | Vendas | `proposal_approved` | [03-sales.md](./03-sales.md) |
| 26 | `subscription_provisioner` | SaaS Church | Webhook `payment_confirmed` (church_base) | [04-saas-church.md](./04-saas-church.md) |
| 27 | `module_activator` | SaaS Church | Webhook `payment_confirmed` (addon) | [04-saas-church.md](./04-saas-church.md) |
| 28 | `onboarding_orchestrator` | SaaS Church | `subscription_activated` | [04-saas-church.md](./04-saas-church.md) |
| 29 | `churn_signal_detector` | SaaS Church | Cron Domingo 22:00 | [04-saas-church.md](./04-saas-church.md) |
| 30 | `renewal_manager` | SaaS Church | Cron diário 07:00 | [04-saas-church.md](./04-saas-church.md) |
| 31 | `dunning_manager` | SaaS Church | Webhook `payment_failed` | [04-saas-church.md](./04-saas-church.md) |
| 32 | `church_reporter` | SaaS Church | Cron dia 1 de cada mês 08:00 | [04-saas-church.md](./04-saas-church.md) |
| 33 | `workspace_provisioner` | Consultoria | `proposal_signed` | [03-sales.md](./03-sales.md) |
| 34 | `oncall_support` | Suporte | Webhook WhatsApp inbound | [05-support.md](./05-support.md) |
| 35 | `incident_dispatcher` | Suporte | `escalation_triggered` | [05-support.md](./05-support.md) |
| 36 | `knowledge_documenter` | Suporte | Cron Domingo 23:00 | [05-support.md](./05-support.md) |
| 37 | `quota_auditor` | Financeiro | Cron a cada 15min | [06-financial.md](./06-financial.md) |
| 38 | `billing_gatekeeper` | Financeiro | `quota_updated` | [06-financial.md](./06-financial.md) |
| 39 | `contract_addendum_processor` | Financeiro | Webhook `payment_confirmed` (ai_credits) | [06-financial.md](./06-financial.md) |
| 40 | `invoice_orchestrator` | Financeiro | Issue `milestone_completed` | [06-financial.md](./06-financial.md) |
| 41 | `financial_reporter` | Financeiro | Cron dia 1 de cada mês 07:00 | [06-financial.md](./06-financial.md) |

---

## Legenda de Tools/MCPs

| Tool / MCP | Usado por |
|---|---|
| `directus_mcp` | Leitura/escrita no Directus com inteligência contextual |
| `paperclip_agent_manager` | CEO — instancia e gerencia sub-agentes |
| `paperclip_issues_tool` | Cria/atualiza issues HITL no Paperclip |
| `hermes_tool` | Envia email ou notificação via Hermes (profile do workspace) |
| `zernio_tool` | Publica posts ou envia WhatsApp via Zernio |
| `litellm_api_tool` | Gerencia Virtual Keys e limites no LiteLLM |
| `gateway_api_tool` | Cria/cancela assinaturas e cobranças no gateway financeiro |
| `clicksign_api_tool` | Upload de PDF e configuração de assinaturas |
| `rag_tool` | Busca vetorial nos docs de suporte |
| `web_search` | Pesquisa na web para conteúdo e tendências |
| `git_tool` | Commits e PRs GitOps (KnowledgeDocumenter, GovernanceAuditor) |
| `http_tool` | Chamadas HTTP genéricas (Cloudflare build, Coolify, Puppeteer) |
| `telegram_tool` | Alertas e relatórios P1 para os sócios |

---

## HITL — Agentes com Aprovação Humana Obrigatória

| Agente | O que bloqueia | Canal de aprovação |
|---|---|---|
| `editorial_gatekeeper` | Publicação de post no blog | Paperclip issue + WhatsApp |
| `editorial_gatekeeper` | Publicação de posts sociais | Paperclip issue + WhatsApp |
| `contract_compiler` | Aprovação de proposta/contrato | Paperclip issue |
| `workspace_provisioner` | Provisioning de workspace de cliente | Paperclip issue |
