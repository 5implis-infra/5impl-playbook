# Fluxo: Billing e Governança de Tokens

> Quota Monitoring → Gatekeepers → Recargas → Relatório Financeiro

---

## Diagrama: Loop de Quota (LiteLLM)

```mermaid
sequenceDiagram
  participant LL as LiteLLM Proxy
  participant QA as QuotaAuditor (15min)
  participant DIR as Directus 5impl
  participant BG as BillingGatekeeper
  participant Client as Cliente / Sócio
  participant GW as Gateway

  Note over QA: Cron a cada 15 minutos
  QA->>LL: GET /usage (todos os Virtual Keys)
  LL-->>QA: logs de uso por key/model/tag
  QA->>DIR: salva/atualiza Token_Usage
  QA->>BG: quota_updated {virtual_key_id, percentage_used, cost_usd}

  BG->>DIR: busca Gatekeepers ordenados por threshold
  loop Para cada Gatekeeper aplicável
    alt action = notify
      BG->>Client: WhatsApp/email "Seus créditos atingiram X%"
    else action = soft_block
      BG->>Client: alerta crítico
      BG->>Socio: Telegram alerta
    else action = hard_block
      BG->>LL: desabilita Virtual Key
      BG->>Client: "Créditos esgotados. Recarregue para continuar."
    end
  end
```

---

## Diagrama: Recarga de Créditos (Addendum)

```mermaid
sequenceDiagram
  participant Client as Cliente
  participant GW as Gateway Financeiro
  participant CAP as ContractAddendumProcessor
  participant LL as LiteLLM API
  participant DIR as Directus 5impl
  participant HM as Hermes

  Client->>GW: compra pacote de créditos
  GW->>CAP: webhook payment_confirmed {ai_credits, workspace_id}
  
  Note over CAP: 3 tarefas atômicas
  CAP->>LL: Tarefa 1: incrementa quota Virtual Key
  LL-->>CAP: quota atualizada
  CAP->>DIR: Tarefa 2: insere Contract_Addendum
  CAP->>GW: Tarefa 3: recalcula assinatura (base + addendums)
  GW-->>CAP: assinatura atualizada
  CAP->>HM: email confirmação ao cliente
  CAP->>Client: WhatsApp "Recarga ativa. Novo limite: X tokens."
```

---

## Diagrama: Relatório Financeiro Mensal

```mermaid
sequenceDiagram
  participant FR as FinancialReporter (dia 1)
  participant DIR as Directus 5impl
  participant S as Sócio
  participant TG as Telegram

  Note over FR: Cron dia 1 07:00
  FR->>DIR: SUM Church_Subscriptions (MRR)
  FR->>DIR: SUM Contract_Addendums recorrentes (expansion)
  FR->>DIR: SUM Consulting_Payments do mês (project)
  FR->>DIR: comparativo com Financial_Snapshot mês anterior
  FR->>FR: calcula: MRR, new MRR, churn, expansion, churn_rate
  FR->>DIR: salva Financial_Snapshot
  FR->>TG: relatório executivo ao Sócio
```

---

## Configuração de Gatekeepers (Exemplo)

```json
[
  {
    "name": "70% Warning — Cliente",
    "threshold": 70,
    "action": "notify",
    "channel": "whatsapp",
    "template_key": "quota_70_client",
    "applies_to": "client",
    "is_active": true
  },
  {
    "name": "90% Soft Block — Cliente",
    "threshold": 90,
    "action": "soft_block",
    "channel": "both",
    "template_key": "quota_90_client",
    "applies_to": "client",
    "is_active": true
  },
  {
    "name": "100% Hard Block — Cliente",
    "threshold": 100,
    "action": "hard_block",
    "channel": "email",
    "template_key": "quota_100_client",
    "applies_to": "client",
    "is_active": true
  },
  {
    "name": "80% Warning — Interno",
    "threshold": 80,
    "action": "notify",
    "channel": "telegram",
    "template_key": "quota_80_internal",
    "applies_to": "internal",
    "is_active": true
  }
]
```

---

## Formato do Relatório Financeiro (Telegram)

```
📊 Relatório Mensal 5impl — Maio 2025

💰 Receita
  MRR:              R$ 12.450
  Consultoria:      R$  8.200
  Total:            R$ 20.650

📈 MRR Movement
  New MRR:         +R$  2.100
  Expansion MRR:   +R$    450
  Churned MRR:     -R$    800
  Net New MRR:     +R$  1.750

🏛️ Church Platform
  Clientes ativos:     18
  Novos este mês:       3
  Cancelamentos:        1
  Churn Rate:         5.3%

⚡ Tokens
  Custo total 5impl: $  42.30
  Maior consumidor:  editorial.content_writer ($12.80)

vs. Abril: +12.4% receita total ✅
```
