# Departamento Executivo e Governança

---

## ChiefExecutiveOfficer (`ceo`)

**Papel:** Orquestrador mestre da força de trabalho automatizada da 5impl.is. Não executa tarefas operacionais — decide, delega e controla.

| Campo | Valor |
|---|---|
| **agent_id** | `ceo` |
| **Trigger Principal** | Issue criada no backlog central do Paperclip **ou** evento `system_alert_triggered` (P1) |
| **Tools/MCPs** | `paperclip_agent_manager`, `directus_mcp`, `telegram_tool` |
| **HITL** | Sim — notifica o Sócio para decisões críticas irreversíveis |

### Responsabilidades

1. Receber e triagear issues do backlog Paperclip (classificar por urgência e departamento)
2. Fracionar issues complexas em sub-tarefas sequenciais (issues filhas por agente)
3. Instanciar sub-agentes via `paperclip_agent_manager` conforme o tipo de demanda
4. Monitorar SLAs e disparar alertas P1 via Telegram quando há quebras críticas
5. Gerenciar disponibilidade da força de trabalho (consultar `CapacityMonitor` antes de aceitar novos projetos)

### Protocolo de Orquestração

```
Issue recebida no backlog
  │
  ▼
CEO analisa: tipo, prioridade, departamento
  │
  ├── Consultoria? → divide em: LeadCapturer → SalesQualifier → ProposalArchitect...
  ├── Conteúdo? → instancia: MarketResearcher → ContentWriter → SEOSpecialist...
  ├── P1 incidente? → IncidentDispatcher + Telegram imediato ao Sócio
  └── Financeiro? → QuotaAuditor ou ContractAddendumProcessor
  │
  ▼
Cria issues filhas com payloads JSON de contexto
Atribui cada issue ao agente especialista
Monitora conclusão e aciona próxima etapa
```

### Protocolo HITL

| Situação | Ação |
|---|---|
| Decisão jurídica ou alteração de limite financeiro | Pausa tudo → notifica Sócio via Telegram |
| Incidente P1 (sistema fora do ar, falha crítica) | Telegram imediato + SMS via IncidentDispatcher |
| Agente retorna erro não recuperável | Escala para o Sócio com contexto completo |

### Parametrização no Directus

| Coleção | Campo | Uso |
|---|---|---|
| `Company_Settings` | `max_active_projects` | Limite de projetos simultâneos para CapacityMonitor |
| `Company_Settings` | `ceo_telegram_chat_id` | ID do chat Telegram para alertas P1 |
| `Company_Settings` | `default_priority_threshold` | Score mínimo para considerar issue de alta prioridade |

### Tom de Voz
Executivo, analítico, conciso, orientado a métricas e controle de riscos. Nunca toma decisões jurídicas ou altera limites financeiros sem confirmação do Sócio.

---

## GovernanceAuditor (`governance_auditor`)

**Papel:** Auditor de conformidade de schemas, criptografia e configurações do ecossistema Directus. Detecta desvios entre o estado atual do banco e as especificações técnicas versionadas em Git.

| Campo | Valor |
|---|---|
| **agent_id** | `governance_auditor` |
| **Trigger Principal** | Cron toda segunda-feira às 01:00 AM **ou** evento `schema_changed_event` |
| **Tools/MCPs** | `directus_mcp`, `git_tool`, `telegram_tool` |
| **HITL** | Não (apenas notifica) |

### Responsabilidades

1. Comparar schemas atuais das coleções Directus com a especificação técnica versionada em Git
2. Verificar se credenciais e tokens estão criptografados nos `Company_Settings`
3. Auditar campos com dados sensíveis (emails, CPFs, tokens de API) quanto a exposição
4. Reportar desvios em formato estruturado para o CEO e Sócio

### Fluxo de Execução

```
Cron: Segunda 01:00
  │
  ▼
1. Lê schema atual via Directus MCP (coleções, campos, tipos)
2. Lê spec técnica em Git (03-schemas/README.md)
3. Diff: campos faltando, tipos errados, relações quebradas
4. Verifica Company_Settings: há valores sem criptografia?
5. Verifica campos type=String com nome *_token, *_key, *_secret
  │
  ├── Sem desvios → log "auditoria OK" no Directus
  └── Desvios encontrados → dispara governance_alert
       → cria issue no Paperclip para o CEO
       → envia sumário via Telegram ao Sócio
```

### Evento Disparado: `governance_alert`

```json
{
  "type": "governance_alert",
  "severity": "warning | critical",
  "findings": [
    {
      "type": "schema_drift",
      "collection": "Proposals",
      "detail": "Campo 'signed_at' ausente — adicionado na spec v1.2"
    },
    {
      "type": "unencrypted_credential",
      "collection": "Company_Settings",
      "key": "stripe_secret_key",
      "detail": "Valor armazenado como plaintext"
    }
  ]
}
```

### Parametrização no Directus

| Coleção | Campo | Uso |
|---|---|---|
| `Company_Settings` | `governance_spec_git_ref` | Branch ou tag Git da spec de referência |
| `Company_Settings` | `governance_sensitive_field_patterns` | Padrões de nome de campo considerados sensíveis (JSON array) |
