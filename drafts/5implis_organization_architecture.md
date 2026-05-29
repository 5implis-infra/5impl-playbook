# 🏛️ Arquitetura Organizacional e Especificação Técnica — 5impl.is

Este documento consolida o design de sistemas, modelagem de processos e arquitetura organizacional para a automação ponta a ponta da **5impl.is** utilizando o framework de agentes **Paperclip**, integrado ao **Directus CMS** e roteado pelo **LiteLLM**.

---

## 🗺️ 1. Organograma e Fluxo de Eventos (Coreografia de Agentes)

O sistema é estruturado sob o conceito de **Separação de Preocupações (SOC)**, **DRY**, **KISS** e **Tell Don't Ask**, orquestrado de forma assíncrona orientada a eventos no Paperclip.

```mermaid
graph TD
    subgraph Central de Comando (5implis Company)
        CEO[ChiefExecutiveOfficer]
        GOV[GovernanceAuditor]
    end

    subgraph Editorial & Marketing (Content & Social Engine)
        CS[ContentSpecialist] -->|Event: content_drafted| DP[DraftPublisher]
        DP -->|Event: draft_created| EG[EditorialGatekeeper]
        EG -->|Event: approval_requested| USER[Sócio / Aprovador]
        USER -->|Event: approved| SP[StaticSitePublisher]
        
        SP -->|Event: content_published| SMS[SocialMediaStrategist]
        SMS -->|Event: social_post_drafted| EG
        EG -->|Event: social_approved| SMP[SocialMediaPublisher]
        SMP -->|Webhook| Zernio[Zernio Social API]
    end

    subgraph Departamento Comercial (Sales & Lead Engine)
        LC[LeadCapturer] -->|Event: raw_lead_captured| SQ[SalesQualifier]
        CM[CapacityMonitor] -->|Status: Enable/Disable| SQ
        SQ -->|Event: lead_qualified| PA[ProposalArchitect]
        PA -->|Event: proposal_drafted| CC[ContractCompiler]
        CC -->|Event: proposal_review_pending| USER
        USER -->|Event: proposal_approved| SO[SignatureOrchestrator]
        SO -->|API Call| Clicksign[Clicksign/ZapSign API]
    end

    subgraph SaaS Church Platform (SaaS Provisioning)
        SP_SaaS[SubscriptionProvisioner] -->|Webhook: payment_confirmed| Directus_SaaS[Directus: Ativação]
        Directus_SaaS -->|Trigger Webhook| SaaS_Engine[Provedor de Instâncias Church]
    end

    subgraph Departamento de Suporte e Infraestrutura (Helpdesk)
        OS[OnCallSupport] -->|Query| AstroDocs[Astro Docs Estáticos]
        OS -->|Escalation| ID[IncidentDispatcher]
        ID -->|Create P1 Issue| CEO
        KD[KnowledgeDocumenter] -->|Git Commit| AstroDocs
    end

    subgraph Departamento Financeiro e Governança (Billing)
        QA[QuotaAuditor] -->|Query Logs| LiteLLM[LiteLLM Proxy API]
        BG[BillingGatekeeper] -->|Action: Soft/Hard Limit| LiteLLM
        CAP[ContractAddendumProcessor] -->|Webhook: credit_purchased| LiteLLM
        CAP -->|Update Quota & Subscription| Directus_Billing[Directus: Contracts]
    end

    CEO -->|Manage| GOV
    CEO -->|Manage| CS
    CEO -->|Manage| CM
    CEO -->|Manage| OS
    CEO -->|Manage| QA
```

---

## 🤖 2. Catálogo Geral de Agentes e Perfis Estruturados (Com Gatilhos)

Abaixo estão detalhadas as especificações de cada agente do ecossistema. As instruções lógicas permanecem em português para preservar o tom de voz da 5impl (PT: direto, confiante; EN: professional, concise), mas os identificadores de classe e nomes seguem o padrão profissional em inglês.

---

### 2.1 Departamento Executivo e Governança

#### **ChiefExecutiveOfficer** (`agent_ceo`)
*   **Trigger Principal:** Issue criada no Backlog central do Paperclip ou Evento `system_alert_triggered` (P1).
*   **Origem dos Dados:** Eventos de novos leads qualificados, alertas de limites de cotas de clientes, e logs de erros de infraestrutura gerados pelas companhias no Paperclip.
*   **Uso dos Dados:** Filtra a prioridade das issues no backlog central e despacha chamadas do `paperclip_agent_manager` para instanciar sub-agentes sob demanda.
*   **Interações:** Interage diretamente com os sócios fundadores humanos para decisões críticas e com todos os diretores de departamentos do Paperclip.
*   **Notificações e Gatilhos:** Dispara notificações P1 para o celular do sócio em caso de quebras críticas de SLAs ou falhas operacionais insolúveis.

#### **GovernanceAuditor** (`governance_auditor`)
*   **Trigger Principal:** Schedule/Cron (Toda segunda-feira às 01:00 AM) ou Evento `schema_changed_event`.
*   **Origem dos Dados:** Tabelas de configurações globais no Directus (`Company_Settings`) e schemas das coleções do banco de dados.
*   **Uso dos Dados:** Compara o estado atual dos schemas no banco com as especificações técnicas da versão atual em git para reportar desvios.
*   **Interações:** Interage com o `ChiefExecutiveOfficer` e o `QuotaAuditor`.
*   **Notificações e Gatilhos:** Dispara alertas de auditoria caso encontre credenciais sem criptografia local ou tokens expostos.

---

### 2.2 Departamento Editorial e Marketing (Content & Social Engine)

#### **ContentSpecialist** (`content_specialist`)
*   **Trigger Principal:** Evento `editorial_schedule_triggered` (Schedule/Cron semanal parametrizado pelo Directus).
*   **Origem dos Dados:** Calendário de publicação dinâmico vindo da coleção `Editorial_Plan` no Directus.
*   **Uso dos Dados:** Pesquisa na web referências de mercado, estruturando artigos ricos em Markdown com otimização completa de metadados SEO.
*   **Interações:** Interage com o `DraftPublisher`.
*   **Notificações e Gatilhos:** Dispara o evento `content_drafted` contendo o payload do artigo estruturado.

#### **DraftPublisher** (`draft_publisher`)
*   **Trigger Principal:** Evento `content_drafted` disparado pelo `ContentSpecialist`.
*   **Origem dos Dados:** Payloads JSON em formato Markdown gerados pelo `ContentSpecialist`.
*   **Uso dos Dados:** Realiza a sanitização das strings e faz a requisição de API para criar um registro com status `Draft` no Directus.
*   **Interações:** Interage com o `ContentSpecialist` e o `EditorialGatekeeper`.
*   **Notificações e Gatilhos:** Dispara o evento `draft_created` contendo o ID gerado pelo banco.

#### **EditorialGatekeeper** (`editorial_gatekeeper`)
*   **Trigger Principal:** Evento `draft_created` ou `social_post_drafted` solicitando aprovação.
*   **Origem dos Dados:** ID do rascunho de conteúdo criado no Directus ou payload da postagem de redes sociais.
*   **Uso dos Dados:** Cria uma issue no Paperclip do Sócio com links rápidos de aprovação (`approve` / `decline`).
*   **Interações:** Interage com o Sócio humano, o `StaticSitePublisher` e o `SocialMediaPublisher`.
*   **Notificações e Gatilhos:** Envia uma notificação interativa no WhatsApp do Sócio solicitando aprovação da publicação.

#### **StaticSitePublisher** (`static_site_publisher`)
*   **Trigger Principal:** Evento `approved` (Aprovação do Sócio via UI do Paperclip).
*   **Origem dos Dados:** Status de aprovação e metadados do post.
*   **Uso dos Dados:** Altera o status do post no Directus para `Published` e dispara o webhook de build do Astro na Cloudflare.
*   **Interações:** Interage com a infraestrutura do Astro e Cloudflare via API.
*   **Notificações e Gatilhos:** Dispara o evento `content_published` e notifica o sócio confirmando a publicação.

#### **SocialMediaStrategist** (`social_media_strategist`)
*   **Trigger Principal:** 
    1.  *Blog-driven:* Evento `content_published` disparado pelo `StaticSitePublisher`.
    2.  *Issue-driven:* Nova issue criada no Paperclip com tag `social_campaign`.
*   **Origem dos Dados:** O corpo do artigo de blog publicado (conforme dados do Directus na categoria configurada) ou a descrição da issue de campanha do Paperclip.
*   **Uso dos Dados:** 
    *   *Blog-driven:* Lê as diretrizes de linhas editoriais no Directus (`Social_Editorial_Rules`) e sintetiza posts curtos para LinkedIn/Instagram.
    *   *Issue-driven:* Lê a descrição da issue. Se a campanha exigir dados de produto ou dados contratuais para ilustrar um post, **tenta instanciar dinamicamente sub-agentes** (ex: `ContentSpecialist` ou `ContractCompiler`) para extrair os dados em lote. Se um sub-agente necessário não puder ser instanciado no Paperclip do cliente, o processo falha imediatamente enviando alerta de erro.
*   **Interações:** Interage com o `EditorialGatekeeper` e agentes auxiliares sob demanda.
*   **Notificações e Gatilhos:** Dispara o evento `social_post_drafted` contendo o lote de postagens para aprovação.

#### **SocialMediaPublisher** (`social_media_publisher`)
*   **Trigger Principal:** Evento `social_approved` (Aprovação do sócio para a campanha social).
*   **Origem dos Dados:** Cópia finalizada dos posts e caminhos das mídias geradas.
*   **Uso dos Dados:** Realiza a chamada HTTP segura (webhook) para postagem direta no painel do **Zernio** (zernio.com) para disparo automático nas redes sociais.
*   **Interações:** Consome APIs do Zernio.
*   **Notificações e Gatilhos:** Dispara notificação confirmando: *"Campanha disparada via Zernio com sucesso"*.

---

### 2.3 Departamento Comercial e Vendas (Sales & Lead Engine)

#### **LeadCapturer** (`lead_capturer`)
*   **Trigger Principal:** Webhook HTTPS externo disparado pela plataforma Zernio.
*   **Origem dos Dados:** JSON enviado pela Zernio com dados de interações ou cadastro de formulários de leads.
*   **Uso dos Dados:** Realiza o mapeamento inicial do lead (nome, empresa, e-mail, origem) e o salva na fila temporária de triagem do Directus.
*   **Interações:** Interage com o `SalesQualifier` para repassar o lead capturado.
*   **Notificações e Gatilhos:** Dispara o evento de sistema `raw_lead_captured` que inicia o fluxo de atendimento.

#### **CapacityMonitor** (`capacity_monitor`)
*   **Trigger Principal:** Evento `issue_status_changed` no Paperclip (ao fechar ou abrir projetos) ou Schedule/Cron periódico (A cada 30 minutos).
*   **Origem dos Dados:** Contagem de issues abertas com a tag `consulting_project` no Paperclip e o campo `max_active_projects` na coleção `Company_Settings` do Directus.
*   **Uso dos Dados:** Calcula a taxa de ocupação real de consultoria:
    $$\text{Occupancy} = \frac{\text{Active Issues}}{\text{Max Capacity}} \times 100$$
    Atualiza o flag de disponibilidade de agenda.
*   **Interações:** Fornece o status de disponibilidade comercial em tempo real para o `SalesQualifier`.
*   **Notificações e Gatilhos:** Atualiza uma flag global de disponibilidade comercial no Directus.

#### **SalesQualifier** (`sales_qualifier`)
*   **Trigger Principal:** Evento `raw_lead_captured` disparado pelo `LeadCapturer` ou mensagem receptiva no WhatsApp.
*   **Origem dos Dados:** Informações capturadas no webhook do `LeadCapturer` e a flag de disponibilidade vinda do `CapacityMonitor`.
*   **Uso dos Dados:** Conduz a conversa no WhatsApp qualificando o orçamento, a dor e o tamanho da empresa do lead.
    *   *Se houver capacidade + lead qualificado:* Direciona para contato síncrono enviando link de agendamento de call.
    *   *Se agenda lotada:* Conduz para fila de espera prioritária para o mês seguinte.
    *   *Se lead desqualificado:* Envia e-mail de nutrição automática (SaaS).
*   **Interações:** Interage com o lead humano no WhatsApp e com o `ProposalArchitect`.
*   **Notificações e Gatilhos:** Dispara o evento `lead_qualified` repassando o perfil detalhado da dor do cliente.

#### **ProposalArchitect** (`proposal_architect`)
*   **Trigger Principal:** Evento `lead_qualified` disparado pelo `SalesQualifier`.
*   **Origem dos Dados:** Requisitos e dores mapeados pelo `SalesQualifier` e os itens de catálogo cadastrados na coleção `Services_Catalog` do Directus.
*   **Uso dos Dados:** Seleciona serviços (integrações, agentes, fluxos n8n), calcula os valores unitários com acréscimos dinâmicos de complexidade e descontos pontuais, gerando o objeto estruturado `Proposal_Object`.
*   **Interações:** Interage com o `ContractCompiler`.
*   **Notificações e Gatilhos:** Envia o evento `proposal_drafted` anexando o payload JSON da proposta.

#### **ContractCompiler** (`contract_compiler`)
*   **Trigger Principal:** Evento `proposal_drafted` disparado pelo `ProposalArchitect`.
*   **Origem dos Dados:** O `Proposal_Object` em formato JSON e o template padrão em Markdown/HTML no Directus.
*   **Uso dos Dados:** Mescla as variáveis contratuais do cliente, monta a tabela discriminada de itens e chama a ferramenta local (Puppeteer) para renderizar e salvar o arquivo PDF.
*   **Interações:** Interage com os Sócios humanos (loop de aprovação síncrona no Paperclip) e com o `SignatureOrchestrator`.
*   **Notificações e Gatilhos:** Bloqueia o processo abrindo a issue de revisão `@itbrda`. Quando aprovado, dispara `proposal_approved`.

#### **SignatureOrchestrator** (`signature_orchestrator`)
*   **Trigger Principal:** Evento `proposal_approved` disparado após aprovação humana da proposta.
*   **Origem dos Dados:** Arquivo PDF do contrato gerado localmente pelo `ContractCompiler`.
*   **Uso dos Dados:** Faz o upload do documento via API, parametriza as partes e captura o link de assinatura gerado.
*   **Interações:** Consome a API da plataforma externa de assinatura.
*   **Notificações e Gatilhos:** Envia o link de assinatura para o agente comum de notificação disparar ao cliente final.

---

### 2.4 Departamento SaaS Church (Provisionamento do Produto)

#### **SubscriptionProvisioner** (`subscription_provisioner`)
*   **Trigger Principal:** Webhook de confirmação de pagamento vindo do gateway financeiro.
*   **Origem dos Dados:** Webhook de confirmação de pagamento recorrente no Cartão de Crédito enviado pelo gateway de pagamento integrado.
*   **Uso dos Dados:** Valida a assinatura, localiza o cliente no banco, atualiza o status para `Active` na coleção `Subscriptions` do Directus e dispara o webhook de provisionamento de infraestrutura.
*   **Interações:** Consome APIs do gateway de pagamentos e envia comandos via webhook para o orquestrador de instâncias (Coolify/Docker).
*   **Notificações e Gatilhos:** Dispara notificação de boas-vindas ao líder da igreja no WhatsApp com os dados de acesso da nova instância ativa.

---

### 2.5 Departamento de Suporte e Infraestrutura

#### **OnCallSupport** (`oncall_support`)
*   **Trigger Principal:** Mensagem de entrada (Webhook) no WhatsApp de suporte dedicado.
*   **Origem dos Dados:** Dúvidas do cliente no WhatsApp de suporte e as pastas de documentação técnica em Markdown (`src/content/docs/`).
*   **Uso dos Dados:** Executa busca vetorial local (RAG) nos manuais para responder dúvidas operacionais. Se identificar bugs ou termos de emergência (ex: "fora do ar"), repassa para escalonamento.
*   **Interações:** Interage com os usuários finais (líderes de igrejas) e o `IncidentDispatcher`.
*   **Notificações e Gatilhos:** Aciona o dispatcher em caso de criticidade.

#### **IncidentDispatcher** (`incident_dispatcher`)
*   **Trigger Principal:** Evento `escalation_triggered` disparado pelo `OnCallSupport`.
*   **Origem dos Dados:** Mensagens críticas ou logs de erro capturados pelo `OnCallSupport`.
*   **Uso dos Dados:** Analisa a severidade do incidente. Se for queda de sistema (P1), abre uma issue de alta gravidade no Paperclip e aciona notificações telefônicas/SMS para os fundadores.
*   **Interações:** Interage com o `ChiefExecutiveOfficer`.
*   **Notificações e Gatilhos:** Dispara notificações SMS/Telegram P1 imediatas.

#### **KnowledgeDocumenter** (`knowledge_documenter`)
*   **Trigger Principal:** Schedule/Cron (Todo domingo às 11:00 PM).
*   **Origem dos Dados:** Histórico de issues de suporte resolvidas e fechadas no Paperclip.
*   **Uso dos Dados:** Analisa os tickets semanalmente, agrupa dúvidas comuns, escreve novos guias em Markdown e realiza commits Git na pasta de documentação do Astro (`src/content/docs/`).
*   **Interações:** Abre Pull Requests/Issues para curadoria final e aprovação dos sócios humanos.
*   **Notificações e Gatilhos:** Alerta o sócio sobre o novo PR de documentação gerado.

---

### 2.6 Departamento Financeiro e Governança de Tokens

#### **QuotaAuditor** (`quota_auditor`)
*   **Trigger Principal:** Schedule/Cron periódico (A cada 15 minutos).
*   **Origem dos Dados:** APIs de log de uso diário extraídas do proxy LiteLLM.
*   **Uso dos Dados:** Totaliza o volume de tokens e custo financeiro por `Virtual Key` e por `Specialty Tag`, persistindo as métricas no Directus.
*   **Interações:** Interage com o `BillingGatekeeper`.
*   **Notificações e Gatilhos:** Atualiza o banco de dados dinâmico de consumo.

#### **BillingGatekeeper** (`billing_gatekeeper`)
*   **Trigger Principal:** Evento `quota_updated` disparado pelo `QuotaAuditor`.
*   **Origem dos Dados:** Tabela de Gatekeepers do Directus e o consumo atualizado pelo `QuotaAuditor`.
*   **Uso dos Dados:** Avalia se o consumo da companhia atingiu os limites dinâmicos parametrizados:
    *   *Se cota >= 80%:* Dispara notificação de aviso de recarga necessária.
    *   *Se cota >= 100%:* Desabilita temporariamente a `Virtual Key` da companhia diretamente no LiteLLM (Hard Limit).
*   **Interações:** Consome a API administrativa do LiteLLM.
*   **Notificações e Gatilhos:** Dispara alertas de consumo para os canais de notificação dos clientes.

#### **ContractAddendumProcessor** (`contract_addendum_processor`)
*   **Trigger Principal:** Webhook de confirmação de pagamento de créditos vindo do gateway financeiro.
*   **Origem dos Dados:** Webhook do gateway financeiro sinalizando a compra de um "Pacote Adicional de Créditos de IA" (recorrente ou pontual).
*   **Uso dos Dados:** Executa três tarefas sequenciais obrigatórias:
    1.  **Quota Update:** Atualiza as cotas e limites da `Virtual Key` do cliente na API do LiteLLM.
    2.  **Addendum Registry:** Insere um novo registro de aditivo financeiro na tabela `Contract_Addendums` do cliente no Directus.
    3.  **Subscription Recalculation:** Soma o valor fixo da proposta aos aditivos recorrentes ativos e atualiza o novo valor de mensalidade final no gateway de pagamento (Cartão de Crédito recorrente).
*   **Interações:** Consome APIs do LiteLLM, Directus e do Gateway Financeiro.
*   **Notificações e Gatilhos:** Envia confirmação de recarga activa e atualização de fatura ao WhatsApp do cliente usando o Agente Comum de Notificações.

---

## 🔄 3. Processo de Recarga de Créditos e Aditivos Contratuais (Fluxo Detalhado)

O processo de recarga e aditivo dinâmico de faturamento funciona de forma totalmente integrada e sem intervenção humana:

```text
[Cliente compra recarga no Painel]
               │
               ▼
[Gateway envia Webhook: payment_confirmed]
               │
               ▼
[ContractAddendumProcessor acorda no Paperclip]
               │
               ├─▶ 1. API LiteLLM: Aumenta cota da Virtual_Key
               ├─▶ 2. Directus: Insere registro em Contract_Addendums
               └─▶ 3. Gateway API: Recalcula mensalidade recorrente (Fixo + Aditivos)
                               │
                               ▼
[Agente Comum Notificação]: Envia WhatsApp confirmando recarga ao cliente.
```

---

## 📊 4. Modelagem de Dados e Schemas (Directus)

### 4.1 Services_Catalog (Catálogo de Tipos de Serviço)
*   `id`: UUID (Chave Primária)
*   `nome`: String (Ex: "Integrações Diversas")
*   `pricePerUnit`: Decimal (Ex: 10.30)
*   `addPerComplexity`: Decimal (Percentual de acréscimo por nível. Ex: 2.4)
*   `i18nKey`: String (Para tradução do catálogo)

### 4.2 Services (Serviços do Portfólio)
*   `id`: UUID
*   `tipoDeServico_id`: Many-to-One ➔ `Services_Catalog.id`
*   `nome`: String (Ex: "Integração Pipedrive CRM")
*   `default_complexity`: Integer (De 1 a 5. Ex: 3)

### 4.3 Proposals (Tabela Geral de Propostas)
*   `id`: UUID
*   `company_name`: String
*   `client_email`: String
*   `total_price`: Decimal
*   `status`: Enum ('draft', 'waiting_approval', 'approved', 'declined')

### 4.4 Proposal_Items (Mapeamento de itens da proposta)
*   `id`: UUID
*   `proposal_id`: Many-to-One ➔ `Proposals.id`
*   `service_id`: Many-to-One ➔ `Services.id`
*   `quantity`: Integer (Ex: 1)
*   `overrideComplexity`: Integer (Opcional - sobrescreve a complexidade padrão)
*   `discountOrAcres`: String (Ex: "-5%" ou "+150.00")

### 4.5 Contract_Addendums (Aditivos de Contrato de Clientes)
*   `id`: UUID
*   `contract_id`: Many-to-One ➔ `Proposals.id`
*   `item_type`: String (Ex: "Token_Credit_Pack")
*   `quantity`: Integer (Ex: 1)
*   `added_price`: Decimal (Ex: 99.00)
*   `billing_type`: Enum ('one_time', 'recurring')

### 4.6 Gatekeepers (Parâmetros Dinâmicos de Cobrança)
*   `id`: String (Ex: "80%-warning")
*   `action`: Enum ('notify', 'block', 'alert')
*   `threshold`: Integer (Ex: 80)
*   `templateMessage`: Text (Ex: "Olá {company}. Seus créditos atingiram {threshold}%.")
*   `i18nKey`: String (Ex: "gatekpt-80-notify")

---

## 🛠️ 5. Script de Inicialização de Coleções (Bootstrap Directus)

```typescript
import { createDirectus, rest, createCollection, createField } from '@directus/sdk';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error("ERRO: DIRECTUS_ADMIN_TOKEN não fornecido nas variáveis de ambiente.");
  process.exit(1);
}

const client = createDirectus(DIRECTUS_URL).with(rest());

async function bootstrap() {
  console.log("⚡ Iniciando provisionamento do Schema de Automação da 5impl no Directus...");

  try {
    // 1. Criar Coleção: Services_Catalog
    console.log("Creating 'Services_Catalog' collection...");
    await client.request(createCollection({
      collection: 'Services_Catalog',
      schema: {},
      meta: { display: 'nome' }
    }));

    await client.request(createField('Services_Catalog', {
      field: 'nome',
      type: 'string',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Services_Catalog', {
      field: 'pricePerUnit',
      type: 'decimal',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Services_Catalog', {
      field: 'addPerComplexity',
      type: 'decimal',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Services_Catalog', {
      field: 'i18nKey',
      type: 'string',
      meta: { interface: 'input' }
    }));

    // 2. Criar Coleção: Services
    console.log("Creating 'Services' collection...");
    await client.request(createCollection({
      collection: 'Services',
      schema: {},
      meta: { display: 'nome' }
    }));

    await client.request(createField('Services', {
      field: 'nome',
      type: 'string',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Services', {
      field: 'default_complexity',
      type: 'integer',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Services', {
      field: 'tipoDeServico_id',
      type: 'uuid',
      meta: { interface: 'select-relational', special: ['m2o'] },
      schema: { foreign_key_column: 'id', foreign_key_table: 'Services_Catalog' }
    }));

    // 3. Criar Coleção: Contract_Addendums
    console.log("Creating 'Contract_Addendums' collection...");
    await client.request(createCollection({
      collection: 'Contract_Addendums',
      schema: {}
    }));

    await client.request(createField('Contract_Addendums', {
      field: 'item_type',
      type: 'string',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Contract_Addendums', {
      field: 'quantity',
      type: 'integer',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Contract_Addendums', {
      field: 'added_price',
      type: 'decimal',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Contract_Addendums', {
      field: 'billing_type',
      type: 'string',
      meta: { interface: 'select', options: { choices: [{text: 'One Time', value: 'one_time'}, {text: 'Recurring', value: 'recurring'}] } }
    }));

    // 4. Criar Coleção: Gatekeepers
    console.log("Creating 'Gatekeepers' collection...");
    await client.request(createCollection({
      collection: 'Gatekeepers',
      schema: {}
    }));

    await client.request(createField('Gatekeepers', {
      field: 'action',
      type: 'string',
      meta: { interface: 'select', required: true, options: { choices: [{text: 'Notify', value: 'notify'}, {text: 'Block', value: 'block'}] } }
    }));

    await client.request(createField('Gatekeepers', {
      field: 'threshold',
      type: 'integer',
      meta: { interface: 'input', required: true }
    }));

    await client.request(createField('Gatekeepers', {
      field: 'templateMessage',
      type: 'text',
      meta: { interface: 'textarea', required: true }
    }));

    await client.request(createField('Gatekeepers', {
      field: 'i18nKey',
      type: 'string',
      meta: { interface: 'input' }
    }));

    console.log("🎉 Bootstrap executado com sucesso! Coleções criadas no Directus.");
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log("ℹ️ Algumas coleções já existem no banco. Pulando criação para proteger dados.");
    } else {
      console.error("❌ Falha no provisionamento do Directus:", error);
      process.exit(1);
    }
  }
}

bootstrap();
```
