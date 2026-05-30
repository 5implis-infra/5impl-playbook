# 📊 Relatório de Divergências e Gaps Arquiteturais — 5impl.is

Este relatório apresenta uma análise crítica e rigorosa confrontando a arquitetura de sistemas multi-agentes (MAS) atualmente desenhada para a **5impl.is** com os padrões de mercado de alta maturidade para **consultorias de automação B2B** e **plataformas SaaS multi-tenant**.

---

## 🔍 1. Metodologia de Varredura e Referências
A análise foi conduzida avaliando:
1.  **Nosso Contexto Local:** Os schemas relacionais do Directus, a esteira de 20 agentes baseados em eventos no Paperclip e o fluxo de secrets locais.
2.  **O Repositório do Projeto:** Princípios definidos em `CONSTITUTION.md` e regras de i18n/estáticas em Astro.
3.  **Estado da Arte do Mercado:** Padrões de MAS empresariais baseados em Hub-Spoke (Supervisor Pattern), barramentos de mensageria baseados em MCP (Model Context Protocol), arquitetura de billing dinâmico com LiteLLM e políticas de governança e isolamento de tenants (compartilhamento seguro de recursos).

---

## ⚠️ 2. Relatório de Divergências e Riscos Críticos (Gaps & Overlaps)

Após confrontar a nossa modelagem com as melhores práticas de infraestrutura SaaS corporativa, foram identificados **6 Gaps Críticos** que representam riscos à segurança, lucratividade e resiliência da 5impl se não forem mitigados na fase de implementação.

### 🔴 Gap 1: Arbitragem de Custos de Tokens (Risco Financeiro)
*   **Divergência:** A arquitetura do `QuotaAuditor` e `BillingGatekeeper` mede a quantidade de *tokens* gastos via LiteLLM por Virtual Key. No entanto, o OpenRouter (e outros providers adjacentes) cobra valores diferentes por 1.000 tokens a depender do modelo (ex: Claude 3.5 Sonnet é significativamente mais caro que o GPT-4o mini).
*   **O Risco:** Se cobrarmos um "plano de recarga de tokens fixo" (ex: 1 milhão de tokens por R$ 50,00) e o cliente usar 100% de Claude 3.5 Sonnet, a 5impl operará em **prejuízo financeiro severo** devido à flutuação de custos de terceiros.
*   **Recomendação de Correção:** 
    *   O Directus deve conter uma tabela de `Token_Cost_Weights` (pesos de custo por modelo).
    *   O `QuotaAuditor` não deve auditar apenas o volume bruto de tokens, mas sim o **custo monetário exato acumulado** retornado pela API do LiteLLM (LiteLLM retorna o custo da chamada em USD no payload de resposta). O cálculo da cota no Directus deve basear-se no valor em moeda (Real/Dólar) consumido, e não em contagem de tokens brutos.

---

### 🔴 Gap 2: Isolamento Físico de Companhias (Risco de Segurança e LGPD)
*   **Divergência:** Foi definido que os clientes são "companhias no Paperclip" que executam agentes e workflows (incluindo n8n e credenciais de secrets criptografadas localmente). 
*   **O Risco:** Se os workspaces de múltiplos clientes (tenants) rodarem no mesmo servidor de banco de dados ou mesmo cluster de Docker sem isolamento estrito de processos (Namespace/Network Isolation), um agente mal-configurado ou com loop infinito de um cliente pode **consumir toda a CPU do cluster**, derrubando a operação de todos os outros clientes (*Noisy Neighbor Effect*), ou pior, acessar dados locais em disco de outra companhia.
*   **Recomendação de Correção:**
    *   **Arquitetura Single-Tenant Executiva:** Cada companhia de cliente no Paperclip deve ser provisionada em uma partição isolada do banco de dados (Directus multi-tenant nativo ou DBs separados por ID de tenant) e com containers Docker de execução de código (n8n/agentes) limitados por limites de cota de CPU/Memória diretamente no orquestrador (Coolify/Docker).

---

### 🟡 Gap 3: Gargalo Síncrono de Aprovação (Risco Operacional/SLA)
*   **Divergência:** O `ContractCompiler` e o `EditorialGatekeeper` pausam o pipeline comercial e de marketing travando o status da issue no Paperclip para `waiting_approval` do sócio humano (`@itbrda`).
*   **O Risco:** Caso o sócio esteja em viagem ou indisponível por 48 horas, o fluxo de atração de novos leads síncronos e o funil de propostas B2B é congelado por completo, gerando atrito no fechamento de negócios.
*   **Recomendação de Correção:**
    *   Implementar uma regra de **Escalonamento por SLA temporal**: Se uma proposta estiver no estado `waiting_approval` por mais de 24 horas, o `ChiefExecutiveOfficer` deve disparar uma notificação de urgência redirecionando a tarefa para um canal alternativo (ex: ligação telefônica via Twilio/IA de voz) ou permitir delegação de assinatura em caso de ausência planejada cadastrada nas configurações.

---

### 🟡 Gap 4: Resiliência de Webhooks e API Limits (Risco de Conectividade)
*   **Divergência:** O `SocialMediaPublisher` envia webhooks de postagem diretamente para a Zernio API, e o `LeadCapturer` recebe dados transacionais síncronos.
*   **O Risco:** Se a API da Zernio estiver instável ou cair temporariamente, a requisição de postagem do agente falha. Como as IAs executam loops rápidos, a falha imediata pode trancar a issue principal com erro de timeout, perdendo o agendamento editorial da semana.
*   **Recomendação de Correção:**
    *   A Skill `SocialMediaPublisher` não deve fazer chamadas síncronas secas. Ela deve implementar uma **Fila de Redespacho Seguro (Outbox Pattern)**. O post é salvo localmente no Directus com status `pending_publish`. Um worker ou a própria skill tenta disparar para o Zernio e executa até 3 tentativas de retry com *backoff* exponencial antes de formalizar a falha da issue.

---

### 🔵 Gap 5: Desprovisionamento e Grace Period (Risco Comercial)
*   **Divergência:** O `BillingGatekeeper` suspende imediatamente a `Virtual Key` no LiteLLM assim que a companhia atinge 100% de uso de créditos.
*   **O Risco:** Bloquear o acesso à API do cliente sem aviso prévio pode quebrar fluxos operacionais internos críticos que ele tem rodando, gerando frustração extrema.
*   **Recomendação de Correção:**
    *   Mapear no Directus um **Grace Period / Saldo Devedor Permitido** (ex: permitir passar até 10% da cota contratada antes de executar o hard block). O cliente entra em "Inadimplência Assistida", recebendo avisos de emergência, dando tempo hábil para o `ContractAddendumProcessor` capturar o webhook de nova compra sem parar a operação dele.

---

### 🔵 Gap 6: Sobreposição de Notificações (Redundância de Código)
*   **Divergência:** Mapeamos no catalogo que múltiplos agentes (como `OnCallSupport`, `IncidentDispatcher`, `QuotaAuditor`) disparam "notificações de WhatsApp/Email".
*   **O Risco:** Isso quebra o princípio **DRY** e aumenta a complexidade de manutenção. Se a API de WhatsApp mudar de provedor, teremos que alterar a Skill/Ferramenta de múltiplos agentes.
*   **Recomendação de Correção:**
    *   Centralização absoluta no **Notification Dispatcher Utility Service**. Nenhum agente operacional possui chaves de WhatsApp ou lógica de envio de mensagens. Eles apenas postam um evento estruturado `trigger_notification` no barramento do Paperclip com o schema:
        ```json
        { "recipient": "phone_or_email", "message": "texto", "priority": "high/medium" }
        ```
    *   Apenas um único agente utilitário ou serviço ouve esse barramento e despacha a mensagem real, mantendo o ecossistema 100% limpo, modular e desacoplado.

---

## 🏆 3. Próximos Passos Recomendados

A nossa modelagem é extremamente avançada e madura, mas para atingir a robustez de um sistema corporativo inabalável, os 6 pontos de correção listados acima serão embutidos diretamente nos fluxos de lógica de programação durante a fase de codificação do projeto.
