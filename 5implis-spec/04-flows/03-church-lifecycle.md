# Fluxo: Ciclo de Vida Church SaaS

> Pagamento → Ativação → Onboarding → Retenção → Dunning → Offboarding

---

## Diagrama de Sequência

```mermaid
sequenceDiagram
  participant GW as Gateway Financeiro
  participant SP as SubscriptionProvisioner
  participant CL as Coolify/Docker
  participant DIR as Directus 5impl
  participant Leader as Líder da Igreja
  participant OO as OnboardingOrchestrator
  participant N8 as n8n (Church activity)
  participant CSD as ChurnSignalDetector
  participant RM as RenewalManager
  participant DM as DunningManager

  GW->>SP: webhook payment_confirmed {church_base}
  SP->>DIR: cria Church_Client + Church_Subscription
  SP->>CL: provisiona instância Docker
  CL-->>SP: {instance_url, credentials}
  SP->>DIR: atualiza Church_Clients com URLs
  SP->>Leader: WhatsApp boas-vindas + credenciais (Zernio)
  SP->>OO: subscription_activated

  Note over OO: Sequência de onboarding
  OO->>Leader: Dia 0: tour + credenciais (WhatsApp)
  OO->>Leader: Dia 2: "Cadastrou membros?" (WhatsApp)
  OO->>Leader: Dia 5: guia financeiro (Email)
  OO->>Leader: Dia 7: check-in (WhatsApp)
  OO->>Leader: Dia 10: call de sucesso (Email)

  Note over N8: Atividade contínua
  Leader->>Leader: usa Church Platform (login, membros, eventos...)
  N8->>DIR: atualiza Church_Clients.last_activity_at

  Note over CSD: Cron Domingo 22:00
  CSD->>DIR: verifica last_activity_at por cliente
  alt 14 dias inativo
    CSD->>CSD: Telegram alerta ao Sócio
  else 30 dias inativo
    CSD->>Leader: email + WhatsApp reengajamento
  end

  Note over RM: Cron diário 07:00
  RM->>DIR: verifica next_billing_date
  RM->>Leader: lembrete 7d/3d/1d antes do vencimento

  GW->>GW: tenta cobrança automática
  alt Pagamento OK
    GW->>SP: payment_confirmed (renovação)
    SP->>DIR: atualiza next_billing_date
  else Pagamento Falhou
    GW->>DM: payment_failed webhook
    DM->>DIR: salva Payment_Failure
    DM->>Leader: D0: aviso WhatsApp + email
    DM->>GW: D3: retry automático
    DM->>Leader: D5: aviso urgente WhatsApp
    DM->>DIR: D7: suspende acesso (status=suspended)
    DM->>Leader: D14: cancela + offboarding
  end
```

---

## Mapa de Módulos por Plano

| Módulo | Starter | Growth | Pro | Enterprise |
|---|---|---|---|---|
| Membros, Financeiro, Eventos | ✅ | ✅ | ✅ | ✅ |
| Cursos, Sermões | ❌ | ✅ | ✅ | ✅ |
| App do Líder, App do Contribuinte | ❌ | ❌ | ✅ | ✅ |
| Multi-Igreja (filiais) | ❌ | ❌ | ❌ | ✅ |
| Media App | Addon | Addon | Addon | Addon |

**Módulos Addon** (comprados separadamente via `ModuleActivator`):
- Media App (`module_media_app`)

---

## Como a Church Platform Verifica Feature Flags

```
Igreja acessa URL de funcionalidade premium
  │
  ▼
Church Platform API → GET /api/subscription/{church_id}/modules
  │
  ▼
Directus 5impl: SELECT module_* FROM Church_Subscriptions WHERE church_id = ?
  │
  ├── module_media_app = true → permite acesso
  └── module_media_app = false → retorna 403 com upgrade CTA
```

A Church Platform NUNCA acessa o CRM interno da 5impl — apenas a coleção `Church_Subscriptions` via API key dedicada com permissão read-only nessa coleção.

---

## Estados de Assinatura

```
trial → active → suspended → cancelled
                    ↑            ↑
               (dunning D7)  (dunning D14)
                    ↓
                 active (se pagamento recuperado)
```

---

## Payloads Chave

### `subscription_activated`
```json
{
  "church_id": "uuid",
  "subscription_id": "uuid",
  "instance_url": "https://church-xyz.app.5impl.is",
  "plan_tier": "growth",
  "modules": {
    "module_media_app": false,
    "module_multi_church": false,
    "module_contributor_app": false,
    "module_leader_app": false,
    "module_courses": true
  }
}
```

### `payment_failed`
```json
{
  "subscription_id": "uuid",
  "church_id": "uuid",
  "gateway_payment_id": "ch_xxx",
  "failure_reason": "insufficient_funds",
  "failed_at": "2025-06-01T10:00:00Z"
}
```
