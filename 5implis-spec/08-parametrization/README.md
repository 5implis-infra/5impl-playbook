# Parametrização de Agentes via Directus

> Como os agentes lêem configurações dinâmicas para adaptar seu comportamento sem alteração de código

---

## Princípio

Toda lógica que pode mudar ao longo do tempo deve estar **no Directus**, não hardcoded no agente. Isso permite:

1. Ajuste de comportamento sem deploy
2. Gerenciamento visual via UI do Directus
3. Histórico de mudanças auditável
4. Futuramente: gestão via React App

---

## Mapa de Parametrização por Agente

### Agentes Editoriais

| Agente | Coleção Consultada | Campos Relevantes |
|---|---|---|
| `EditorialPlanner` | `Editorial_Pillars` | `min_posts_per_month`, `priority_weight`, `trend_keywords` |
| `ImageDirector` | `Content_Channels` | `asset_strategy`, `ai_image_style`, `ai_image_model`, `canva_template_id` |
| `SocialMediaStrategist` | `Social_Editorial_Rules` | `tone_guidelines`, `brand_hashtags`, `emoji_usage` |
| `InstagramCopywriter` | `Content_Channels` | `hashtag_count`, `max_chars` |
| `SocialMediaPublisher` | `Content_Channels` | `posting_time` por plataforma |
| `ContentAnalyst` | `Company_Settings` | `content_scoring_weights` (JSON) |

### Agentes de Vendas

| Agente | Coleção Consultada | Campos Relevantes |
|---|---|---|
| `LeadNurturer` | `Lead_Nurture_Sequences` + `Lead_Nurture_Steps` | Toda a sequência, templates, delays |
| `CapacityMonitor` | `Company_Settings` | `max_active_projects`, `availability_flag` |
| `ProposalArchitect` | `Services_Catalog` + `Services` | `pricePerUnit`, `addPerComplexity`, `default_complexity` |

### Agentes SaaS Church

| Agente | Coleção Consultada | Campos Relevantes |
|---|---|---|
| `OnboardingOrchestrator` | `Onboarding_Steps` | Toda a sequência, templates, day_offset |
| `DunningManager` | `Dunning_Rules` | `trigger_days`, `action`, `channel`, `template_key` |
| `ChurnSignalDetector` | `Company_Settings` | `churn_inactivity_warning_days`, `churn_inactivity_critical_days` |

### Agentes Financeiros

| Agente | Coleção Consultada | Campos Relevantes |
|---|---|---|
| `BillingGatekeeper` | `Gatekeepers` | `threshold`, `action`, `channel`, `template_key`, `applies_to` |
| `QuotaAuditor` | Configuração via LiteLLM (não Directus) | Virtual Keys e limites |

### Agentes de Suporte

| Agente | Coleção Consultada | Campos Relevantes |
|---|---|---|
| `OnCallSupport` | `Company_Settings` | `support_escalation_keywords` (JSON array) |

---

## Estrutura de `Company_Settings`

Coleção chave-valor com tipagem para configurações globais:

```typescript
// Chaves obrigatórias na instalação inicial
const required_settings = [
  // Capacidade
  { key: 'max_active_projects', value: '5', type: 'integer' },
  { key: 'availability_flag', value: 'available', type: 'string' },

  // Integrações
  { key: 'cloudflare_build_webhook', value: 'https://...', type: 'string' },
  { key: 'ceo_telegram_chat_id', value: '123456789', type: 'string' },
  { key: 'success_call_calendly_url', value: 'https://calendly.com/...', type: 'string' },

  // Templates de documentos
  { key: 'contract_template_html', value: '<html>...', type: 'string' },
  { key: 'invoice_html_template', value: '<html>...', type: 'string' },
  { key: 'church_report_email_template', value: '...', type: 'string' },

  // Links de tutoriais (Church onboarding)
  { key: 'tutorial_members_url', value: 'https://...', type: 'string' },
  { key: 'tutorial_financial_url', value: 'https://...', type: 'string' },

  // Scoring de conteúdo
  {
    key: 'content_scoring_weights',
    value: '{"organic_clicks": 0.4, "shares": 0.3, "views": 0.2, "comments": 0.1}',
    type: 'json'
  },

  // Suporte
  {
    key: 'support_escalation_keywords',
    value: '["fora do ar", "erro crítico", "perdeu dados", "não consigo acessar"]',
    type: 'json'
  },

  // Churn detection
  { key: 'churn_inactivity_warning_days', value: '14', type: 'integer' },
  { key: 'churn_inactivity_critical_days', value: '30', type: 'integer' },

  // Governança
  { key: 'governance_spec_git_ref', value: 'main', type: 'string' },
  {
    key: 'governance_sensitive_field_patterns',
    value: '["*_token", "*_key", "*_secret", "*_password"]',
    type: 'json'
  },

  // Conteúdo
  { key: 'top_performing_pillars', value: '[]', type: 'json' }
];
```

---

## Como um Agente Lê Parâmetros

Padrão de leitura via `directus_mcp`:

```
// Exemplo: DunningManager lendo regras
Prompt do agente:
  "Antes de executar, leia as regras de dunning:
   GET /items/Dunning_Rules?filter[is_active][_eq]=true&sort=trigger_days
   Use essas regras para determinar quais ações executar."

// Exemplo: BillingGatekeeper avaliando thresholds
Prompt do agente:
  "Leia os Gatekeepers ativos ordenados por threshold:
   GET /items/Gatekeepers?filter[is_active][_eq]=true&sort=threshold
   Aplique cada gatekeeper ao consumo atual da Virtual Key."
```

---

## Adicionando Novos Parâmetros

Para adicionar um novo parâmetro configurável:

1. Adicionar entrada em `Company_Settings` via Directus UI
2. Documentar o parâmetro neste arquivo (tabela por agente)
3. Referenciar no prompt do agente com instrução de leitura
4. Adicionar ao script `bootstrap.ts` para instalações futuras

---

## Parametrização de Gatekeepers — Exemplo Completo

O `BillingGatekeeper` é o exemplo mais completo de parametrização dinâmica. Toda a sua lógica de negócio está no Directus:

```
Sem parâmetros no código → 100% configurável via UI

Gatekeeper 1: 70% → notify → whatsapp → template "cota 70%"
Gatekeeper 2: 90% → soft_block → both → template "cota 90% urgente"
Gatekeeper 3: 100% → hard_block → email → template "cota esgotada"

Para adicionar um novo threshold (ex: 50% para plan básico):
  → Inserir nova linha em Gatekeepers via Directus UI
  → Nenhuma mudança de código necessária
```

Isso vale para: `Dunning_Rules`, `Onboarding_Steps`, `Lead_Nurture_Steps`, `Editorial_Pillars`, `Content_Channels`, `Social_Editorial_Rules`.
