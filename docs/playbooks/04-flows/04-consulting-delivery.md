# Fluxo: Entrega de Consultoria

> Pós-assinatura → Provisionamento → Kickoff → Milestones → Invoice → Encerramento

---

## Diagrama de Sequência

```mermaid
sequenceDiagram
  participant SO as SignatureOrchestrator
  participant WP as WorkspaceProvisioner
  participant S as Sócio (HITL)
  participant PB as Paperclip Admin
  participant LL as LiteLLM API
  participant N8 as n8n Admin
  participant DIR as Directus Admin
  participant HM as Hermes
  participant Client as Cliente
  participant IO as InvoiceOrchestrator
  participant PP as Puppeteer Service

  SO->>WP: proposal_signed {company_slug, plan_limits}

  WP->>S: Issue HITL: "Revisar provisionamento + fornecer SMTP do cliente"
  Note right of S: Inclui: plano, quota, milestones, dados para Hermes profile
  S->>WP: provisioning_approved {smtp_credentials}

  par Provisionamento paralelo
    WP->>PB: criar workspace client-{slug}
    WP->>LL: criar Virtual Key client-{slug} (quota contrato)
    WP->>N8: criar tenant client-{slug}
    WP->>DIR: provisionar instância Directus client-{slug}
    WP->>HM: configurar profile client-{slug} (SMTP)
  end

  WP->>WP: registra todos os IDs em Companies (Directus 5impl)
  WP->>PB: cria issue kickoff no workspace do cliente
  WP->>HM: envia email boas-vindas ao cliente

  Note over Client,PB: Projeto em andamento no workspace do cliente

  loop Para cada milestone do projeto
    Note over S,PB: Sócio fecha issue milestone_completed no Paperclip
    IO->>IO: detecta issue milestone_completed
    IO->>IO: busca Consulting_Milestones no Directus
    IO->>PP: POST render invoice PDF
    PP-->>IO: PDF binário
    IO->>IO: salva PDF, atualiza milestone status='invoiced'
    IO->>HM: envia email com invoice ao cliente
    IO->>S: Telegram "Invoice #{n} enviada — R$ {valor}"
    Client->>IO: paga invoice
    GW-->>IO: payment_confirmed → status='paid'
  end
```

---

## Checklist de Provisionamento

O `WorkspaceProvisioner` valida cada passo antes de prosseguir:

| # | Recurso | Ferramenta | Verificação |
|---|---|---|---|
| 1 | Workspace Paperclip | `paperclip_agent_manager` | workspace_id retornado |
| 2 | Virtual Key LiteLLM | `litellm_api_tool` | key ativa e com quota configurada |
| 3 | Tenant n8n | `http_tool` (n8n admin API) | workspace_id retornado |
| 4 | Instância Directus | `http_tool` (Directus admin) | URL acessível (200 OK) |
| 5 | Profile Hermes | Hermes adapter | teste de envio de email |
| 6 | Registro no CRM | `directus_mcp` | Companies.id salvo |
| 7 | Issue kickoff | `paperclip_issues_tool` | issue_url retornada |
| 8 | Email boas-vindas | `hermes_tool` | enviado sem erro |

**Em caso de falha:** cria issue no Paperclip com o step que falhou e o erro. Não executa rollback automático. O Sócio deve decidir como proceder.

---

## Estrutura de Milestones Padrão

Configurável no `ContractCompiler` com base no tipo de projeto:

| Tipo de Projeto | Milestone 1 | Milestone 2 | Milestone 3 |
|---|---|---|---|
| Automação completa | Mapeamento e setup (30%) | Desenvolvimento e testes (50%) | Entrega e treinamento (20%) |
| Integração pontual | Setup e configuração (50%) | Entrega e ajustes (50%) | — |
| Consultoria mensal | Retainer mensal | Retainer mensal | ... |

---

## Payload: `workspace_provisioned`
```json
{
  "company_id": "uuid",
  "company_slug": "empresa-xyz",
  "resources": {
    "paperclip_workspace_id": "ws_xyz",
    "litellm_virtual_key": "sk-client-xyz",
    "n8n_workspace_id": "n8n_xyz",
    "directus_instance_url": "https://directus.client-xyz.com",
    "hermes_profile": "client-xyz"
  },
  "provisioned_at": "2025-06-01T10:00:00Z"
}
```
