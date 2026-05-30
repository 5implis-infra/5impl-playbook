# Fluxo: Lead → Contrato

> Captura → Qualificação → Proposta → Assinatura → Provisionamento

---

## Diagrama de Sequência

```mermaid
sequenceDiagram
  participant Lead
  participant ZR as Zernio / WhatsApp
  participant LC as LeadCapturer
  participant WI as WaitlistIngester
  participant LN as LeadNurturer
  participant CM as CapacityMonitor
  participant SQ as SalesQualifier
  participant PA as ProposalArchitect
  participant CC as ContractCompiler
  participant S as Sócio (HITL)
  participant SO as SignatureOrchestrator
  participant CS as Clicksign
  participant WP as WorkspaceProvisioner

  alt Site Waitlist
    Lead->>WI: POST /waitlist {email, name, vertical}
    WI->>WI: salva em Directus Waitlist
    WI->>Lead: email confirmação (Hermes)
    WI->>LN: adiciona à sequência nurture
    loop Nutrição
      LN->>Lead: email/WhatsApp D0, D3, D7, D14...
    end
  else Zernio Form / WhatsApp direto
    Lead->>ZR: preenche formulário ou envia mensagem
    ZR->>LC: webhook {lead data}
    LC->>LC: normaliza e salva em Directus Leads
    LC->>SQ: raw_lead_captured
  end

  Note over CM: Cron 30min
  CM->>CM: conta projetos ativos no Paperclip
  CM->>CM: atualiza Company_Settings.availability_flag

  SQ->>ZR: inicia conversa BANT no WhatsApp
  SQ->>Lead: qualificação via WhatsApp (budget, dor, timeline)

  alt Qualificado + Agenda disponível
    SQ->>Lead: envia link Calendly para call
    SQ->>PA: lead_qualified {qualification_profile}
    PA->>PA: lê Services_Catalog no Directus
    PA->>PA: calcula preços com complexidade e descontos
    PA->>PA: salva Proposal em Directus
    PA->>CC: proposal_drafted {proposal_object}
    CC->>CC: mescla template HTML com variáveis
    CC->>CC: POST Puppeteer → gera PDF
    CC->>S: Issue HITL: "Revisar proposta #{id} para {company}"
    S->>CC: proposal_approved
    CC->>SO: proposal_approved {pdf_path}
    SO->>CS: upload PDF + configura signatários
    CS-->>SO: signing_link
    SO->>Lead: email com link de assinatura (Hermes)
    CS-->>SO: webhook signature_completed
    SO->>SO: atualiza Proposals.status = signed
    SO->>WP: proposal_signed {company_slug, plan}
  else Agenda cheia
    SQ->>Lead: "Agenda lotada — fila prioritária para próximo mês"
    SQ->>SQ: atualiza Lead.status = waitlisted
  else Desqualificado
    SQ->>LN: adiciona à sequência nurture disqualified
    LN->>Lead: email de nutrição automática
  end
```

---

## Estados do Lead

```
new → nurturing → qualified → [won | lost | disqualified]
         ↑
    waitlisted (agenda cheia)
```

---

## Lógica de Preço da Proposta

```
Para cada Proposal_Item:
  base_price = Services.default_complexity × Services_Catalog.addPerComplexity

  Se overrideComplexity definido:
    complexity = overrideComplexity
  Senão:
    complexity = Services.default_complexity

  unit_price = Services_Catalog.pricePerUnit × (1 + complexity × addPerComplexity / 100)

  Se discountOrAcres:
    Se começa com '-': aplica desconto percentual ou absoluto
    Se começa com '+': aplica acréscimo percentual ou absoluto

  item_total = unit_price × quantity

total_price = SUM(item_total)
```

---

## Payloads Chave

### `lead_qualified`
```json
{
  "lead_id": "uuid",
  "vertical": "business",
  "qualification_profile": {
    "budget_range": "R$ 5k–10k/mês",
    "main_pain": "Processo de onboarding de clientes 100% manual",
    "timeline": "Quer começar em 30 dias",
    "company_size": "small",
    "decision_maker": true
  }
}
```

### `proposal_drafted`
```json
{
  "proposal_id": "uuid",
  "company_name": "Empresa XYZ",
  "client_email": "cto@xyz.com",
  "items": [
    {
      "service": "Integração Pipedrive CRM",
      "complexity": 3,
      "quantity": 1,
      "unit_price": 850.00,
      "discount": "-5%",
      "total": 807.50
    }
  ],
  "total_price": 807.50
}
```

### `proposal_signed`
```json
{
  "proposal_id": "uuid",
  "company_slug": "empresa-xyz",
  "company_name": "Empresa XYZ",
  "client_email": "cto@xyz.com",
  "plan_limits": {
    "token_quota_monthly": 500000,
    "litellm_virtual_key": "sk-client-xyz"
  }
}
```
