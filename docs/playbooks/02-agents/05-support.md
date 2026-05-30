# Departamento de Suporte e Infraestrutura

> 3 agentes cobrindo atendimento 24/7, gestão de incidentes e documentação contínua

---

## OnCallSupport (`oncall_support`)

| Campo | Valor |
|---|---|
| **agent_id** | `oncall_support` |
| **Trigger** | Webhook de mensagem inbound no WhatsApp de suporte dedicado |
| **Tools/MCPs** | `rag_tool` (busca vetorial nos docs), `zernio_tool` (WhatsApp), `directus_mcp` |

**Responsabilidade:** Resolver dúvidas operacionais dos usuários da Church Platform via WhatsApp, usando RAG sobre a documentação técnica. Escalar incidentes críticos de forma imediata.

**Fluxo:**
```
Mensagem inbound recebida no WhatsApp de suporte
  │
  ▼
1. Classifica mensagem:
   - Dúvida operacional (como fazer X)?
   - Bug reportado (algo não está funcionando)?
   - Emergência (sistema fora do ar, perda de dados)?

2. Para dúvida operacional:
   a. Executa RAG em src/content/docs/ com a pergunta
   b. Retorna resposta contextualizada ao usuário
   c. Se confiança < 0.7: "Não encontrei exatamente, vou escalar para um especialista"

3. Para bug ou emergência:
   a. Coleta: descrição, screenshots (se enviados), horário do ocorrido
   b. Registra interação em Interactions no Directus
   c. Dispara escalation_triggered com contexto coletado

4. Loga toda interação em Directus (lead_id/church_id, content, created_at)
```

**Base de conhecimento:** Pastas `src/content/docs/` do repositório Git — atualizada automaticamente pelo `KnowledgeDocumenter` toda semana.

**Palavras-chave de emergência** (configurável em `Company_Settings.support_escalation_keywords`):
`["fora do ar", "erro crítico", "perdeu dados", "não consigo acessar", "sistema parou"]`

---

## IncidentDispatcher (`incident_dispatcher`)

| Campo | Valor |
|---|---|
| **agent_id** | `incident_dispatcher` |
| **Trigger** | `escalation_triggered` disparado pelo `OnCallSupport` |
| **Tools/MCPs** | `paperclip_issues_tool`, `telegram_tool`, `hermes_tool` |

**Responsabilidade:** Triagem de severidade e abertura de incidentes com notificação imediata proporcional à criticidade.

**Classificação de Severidade:**

| Severidade | Critério | Resposta |
|---|---|---|
| **P1** | Sistema fora do ar / Perda de dados | Issue P1 Paperclip + Telegram imediato aos sócios |
| **P2** | Feature crítica degradada | Issue P2 Paperclip + Email ao time técnico |
| **P3** | Bug menor / Comportamento inesperado | Issue P3 Paperclip + resposta ao usuário via WhatsApp |

**Fluxo:**
```
escalation_triggered recebido { church_id, description, context }
  │
  ▼
Analisa keywords e contexto para classificar P1/P2/P3
  │
  ├── P1:
  │   → Cria issue no Paperclip: "🚨 P1 — {church_name}: {descrição}"
  │   → Telegram imediato aos sócios: descrição + link da issue
  │   → WhatsApp ao usuário: "Sua solicitação é P1. Time notificado. Retorno em até 30min."
  │
  ├── P2:
  │   → Cria issue no Paperclip com tag P2
  │   → Email ao time (hermes_tool)
  │   → WhatsApp ao usuário: "Registramos o problema. Previsão de resolução: 4h."
  │
  └── P3:
      → Cria issue no Paperclip com tag P3
      → WhatsApp ao usuário: "Registramos. Você receberá uma atualização em breve."
```

**Output:** `incident_created { incident_id, severity, paperclip_issue_url }`

---

## KnowledgeDocumenter (`knowledge_documenter`)

| Campo | Valor |
|---|---|
| **agent_id** | `knowledge_documenter` |
| **Trigger** | Cron todo domingo às 23:00 |
| **Tools/MCPs** | `paperclip_agent_manager` (lista tickets fechados), `git_tool`, `directus_mcp` |

**Responsabilidade:** Transformar tickets de suporte resolvidos em documentação permanente, prevenindo que as mesmas dúvidas se repitam.

**Fluxo:**
```
Cron Domingo 23:00:
  │
  1. Busca todas as issues do Paperclip fechadas na última semana
     (com tag 'support' ou 'oncall')

  2. Agrupa por similaridade semântica (tópico/problema)
     - Identifica padrões: "dúvida sobre financeiro", "problema de acesso", etc.

  3. Para grupos com ≥ 3 occorrências similares:
     - Escreve novo guia em Markdown:
       - Título: "Como [fazer X] na Church Platform"
       - Seções: problema, solução passo-a-passo, print sugerido
     - Salva em src/content/docs/{slug}.md via git_tool

  4. Para soluções de bugs P2/P3 resolvidos:
     - Escreve FAQ entry com causa + solução

  5. Faz commit Git: "docs: add {n} guides from weekly support review"
  6. Abre Pull Request para curadoria final do Sócio
  7. Notifica Sócio via Telegram: "PR de documentação criado — {n} novos guias"
```

**Output:** PR no GitHub + `documentation_pr_created { pr_url, guides_count }`

**Impacto:** A cada ciclo semanal, a base de conhecimento do `OnCallSupport` cresce, reduzindo progressivamente o volume de escalações.
