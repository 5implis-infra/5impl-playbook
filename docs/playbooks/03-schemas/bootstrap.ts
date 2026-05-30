/**
 * Bootstrap Directus — 5impl.is
 * Provisiona todas as coleções do workspace 5impl no Directus.
 * Run: npx ts-node bootstrap.ts
 */

import {
  createDirectus, rest, authentication,
  createCollection, createField, createRelation,
  createItem
} from '@directus/sdk';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error('ERRO: DIRECTUS_ADMIN_TOKEN não fornecido.');
  process.exit(1);
}

const client = createDirectus(DIRECTUS_URL).with(rest());

// Helper: cria coleção ignorando se já existe
async function safeCreateCollection(payload: object) {
  try {
    await client.request(createCollection(payload as any));
  } catch (e: any) {
    if (!e.message?.includes('already exists')) throw e;
  }
}

// Helper: cria campo ignorando se já existe
async function safeCreateField(collection: string, payload: object) {
  try {
    await client.request(createField(collection, payload as any));
  } catch (e: any) {
    if (!e.message?.includes('already exists')) throw e;
  }
}

async function bootstrap() {
  console.log('⚡ Iniciando bootstrap do Directus 5impl.is...\n');

  // ─── CRM ──────────────────────────────────────────────────────────────────

  console.log('📋 CRM: Waitlist');
  await safeCreateCollection({ collection: 'Waitlist', schema: {}, meta: { display: 'email' } });
  for (const f of [
    { field: 'email', type: 'string', meta: { required: true } },
    { field: 'name', type: 'string' },
    { field: 'vertical', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Negócios', value: 'business' },
      { text: 'Igreja', value: 'church' },
      { text: 'Mídia', value: 'media' },
    ]}}},
    { field: 'created_at', type: 'timestamp' },
    { field: 'converted_to_lead', type: 'boolean', schema: { default_value: false } },
  ]) await safeCreateField('Waitlist', f);

  console.log('📋 CRM: Leads');
  await safeCreateCollection({ collection: 'Leads', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'email', type: 'string', meta: { required: true } },
    { field: 'phone', type: 'string' },
    { field: 'company_name', type: 'string' },
    { field: 'source', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Waitlist', value: 'waitlist' },
      { text: 'Zernio', value: 'zernio' },
      { text: 'WhatsApp', value: 'whatsapp' },
      { text: 'Indicação', value: 'referral' },
      { text: 'Direto', value: 'direct' },
    ]}}},
    { field: 'vertical', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Negócios', value: 'business' },
      { text: 'Igreja', value: 'church' },
      { text: 'Mídia', value: 'media' },
    ]}}},
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Novo', value: 'new' },
      { text: 'Nutrindo', value: 'nurturing' },
      { text: 'Qualificado', value: 'qualified' },
      { text: 'Ganho', value: 'won' },
      { text: 'Perdido', value: 'lost' },
      { text: 'Desqualificado', value: 'disqualified' },
    ]}}},
    { field: 'notes', type: 'text' },
    { field: 'created_at', type: 'timestamp' },
    { field: 'converted_at', type: 'timestamp' },
  ]) await safeCreateField('Leads', f);

  console.log('📋 CRM: Companies');
  await safeCreateCollection({ collection: 'Companies', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'cnpj', type: 'string' },
    { field: 'segment', type: 'string' },
    { field: 'size', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'MEI', value: 'MEI' }, { text: 'Pequena', value: 'small' },
      { text: 'Média', value: 'medium' }, { text: 'Grande', value: 'large' },
    ]}}},
    { field: 'city', type: 'string' }, { field: 'state', type: 'string' },
    { field: 'website', type: 'string' },
    { field: 'paperclip_workspace_id', type: 'string' },
    { field: 'litellm_virtual_key', type: 'string' },
    { field: 'n8n_workspace_id', type: 'string' },
    { field: 'directus_instance_url', type: 'string' },
  ]) await safeCreateField('Companies', f);

  console.log('📋 CRM: Deals');
  await safeCreateCollection({ collection: 'Deals', schema: {}, meta: { display: 'id' } });
  for (const f of [
    { field: 'stage', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Descoberta', value: 'discovery' }, { text: 'Proposta', value: 'proposal' },
      { text: 'Negociação', value: 'negotiation' }, { text: 'Ganho', value: 'won' },
      { text: 'Perdido', value: 'lost' },
    ]}}},
    { field: 'expected_value', type: 'decimal' },
    { field: 'close_date', type: 'date' },
    { field: 'notes', type: 'text' },
  ]) await safeCreateField('Deals', f);

  console.log('📋 CRM: Interactions');
  await safeCreateCollection({ collection: 'Interactions', schema: {} });
  for (const f of [
    { field: 'type', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'WhatsApp', value: 'whatsapp' }, { text: 'Email', value: 'email' },
      { text: 'Ligação', value: 'call' }, { text: 'Nota', value: 'note' },
    ]}}},
    { field: 'direction', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Entrada', value: 'inbound' }, { text: 'Saída', value: 'outbound' },
    ]}}},
    { field: 'content', type: 'text', meta: { required: true } },
    { field: 'agent_id', type: 'string' },
    { field: 'created_at', type: 'timestamp' },
  ]) await safeCreateField('Interactions', f);

  // ─── Nutrição ─────────────────────────────────────────────────────────────

  console.log('💧 Nutrição: Lead_Nurture_Sequences');
  await safeCreateCollection({ collection: 'Lead_Nurture_Sequences', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'vertical', type: 'string' },
    { field: 'trigger_on_status', type: 'string' },
    { field: 'is_active', type: 'boolean', schema: { default_value: true } },
  ]) await safeCreateField('Lead_Nurture_Sequences', f);

  console.log('💧 Nutrição: Lead_Nurture_Steps');
  await safeCreateCollection({ collection: 'Lead_Nurture_Steps', schema: {} });
  for (const f of [
    { field: 'step_order', type: 'integer', meta: { required: true } },
    { field: 'delay_days', type: 'integer', meta: { required: true } },
    { field: 'channel', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Email', value: 'email' }, { text: 'WhatsApp', value: 'whatsapp' },
    ]}}},
    { field: 'subject', type: 'string' },
    { field: 'body_template', type: 'text', meta: { required: true } },
  ]) await safeCreateField('Lead_Nurture_Steps', f);

  console.log('💧 Nutrição: Lead_Nurture_Progress');
  await safeCreateCollection({ collection: 'Lead_Nurture_Progress', schema: {} });
  for (const f of [
    { field: 'current_step', type: 'integer', schema: { default_value: 1 } },
    { field: 'next_send_at', type: 'timestamp' },
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Ativo', value: 'active' }, { text: 'Pausado', value: 'paused' },
      { text: 'Concluído', value: 'completed' }, { text: 'Descadastrado', value: 'unsubscribed' },
    ]}}},
    { field: 'started_at', type: 'timestamp' },
    { field: 'last_sent_at', type: 'timestamp' },
  ]) await safeCreateField('Lead_Nurture_Progress', f);

  // ─── Vendas ───────────────────────────────────────────────────────────────

  console.log('💼 Vendas: Services_Catalog');
  await safeCreateCollection({ collection: 'Services_Catalog', schema: {}, meta: { display: 'nome' } });
  for (const f of [
    { field: 'nome', type: 'string', meta: { required: true } },
    { field: 'pricePerUnit', type: 'decimal', meta: { required: true } },
    { field: 'addPerComplexity', type: 'decimal', meta: { required: true } },
    { field: 'i18nKey', type: 'string' },
  ]) await safeCreateField('Services_Catalog', f);

  console.log('💼 Vendas: Services');
  await safeCreateCollection({ collection: 'Services', schema: {}, meta: { display: 'nome' } });
  for (const f of [
    { field: 'nome', type: 'string', meta: { required: true } },
    { field: 'default_complexity', type: 'integer', meta: { required: true } },
  ]) await safeCreateField('Services', f);

  console.log('💼 Vendas: Proposals');
  await safeCreateCollection({ collection: 'Proposals', schema: {}, meta: { display: 'company_name' } });
  for (const f of [
    { field: 'company_name', type: 'string', meta: { required: true } },
    { field: 'client_email', type: 'string', meta: { required: true } },
    { field: 'total_price', type: 'decimal' },
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Rascunho', value: 'draft' },
      { text: 'Aguardando Aprovação', value: 'waiting_approval' },
      { text: 'Aprovado', value: 'approved' },
      { text: 'Recusado', value: 'declined' },
      { text: 'Assinado', value: 'signed' },
    ]}}},
    { field: 'contract_pdf_path', type: 'string' },
    { field: 'signed_at', type: 'timestamp' },
  ]) await safeCreateField('Proposals', f);

  console.log('💼 Vendas: Proposal_Items');
  await safeCreateCollection({ collection: 'Proposal_Items', schema: {} });
  for (const f of [
    { field: 'quantity', type: 'integer', meta: { required: true } },
    { field: 'overrideComplexity', type: 'integer' },
    { field: 'discountOrAcres', type: 'string' },
  ]) await safeCreateField('Proposal_Items', f);

  // ─── Financeiro ───────────────────────────────────────────────────────────

  console.log('💰 Financeiro: Gatekeepers');
  await safeCreateCollection({ collection: 'Gatekeepers', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'threshold', type: 'integer', meta: { required: true } },
    { field: 'action', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Notificar', value: 'notify' },
      { text: 'Bloqueio Suave', value: 'soft_block' },
      { text: 'Bloqueio Total', value: 'hard_block' },
    ]}}},
    { field: 'channel', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'WhatsApp', value: 'whatsapp' }, { text: 'Email', value: 'email' },
      { text: 'Ambos', value: 'both' }, { text: 'Telegram', value: 'telegram' },
    ]}}},
    { field: 'template_key', type: 'string' },
    { field: 'applies_to', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Cliente', value: 'client' }, { text: 'Interno', value: 'internal' },
    ]}}},
    { field: 'is_active', type: 'boolean', schema: { default_value: true } },
  ]) await safeCreateField('Gatekeepers', f);

  console.log('💰 Financeiro: Dunning_Rules');
  await safeCreateCollection({ collection: 'Dunning_Rules', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'trigger_days', type: 'integer', meta: { required: true } },
    { field: 'action', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Notificar Cliente', value: 'notify_client' },
      { text: 'Tentar Pagamento', value: 'retry_payment' },
      { text: 'Suspender Acesso', value: 'suspend_access' },
      { text: 'Cancelar Assinatura', value: 'cancel_subscription' },
    ]}}},
    { field: 'channel', type: 'string' },
    { field: 'template_key', type: 'string' },
    { field: 'grace_period_hours', type: 'integer', schema: { default_value: 0 } },
    { field: 'is_active', type: 'boolean', schema: { default_value: true } },
  ]) await safeCreateField('Dunning_Rules', f);

  console.log('💰 Financeiro: Contract_Addendums');
  await safeCreateCollection({ collection: 'Contract_Addendums', schema: {} });
  for (const f of [
    { field: 'item_type', type: 'string', meta: { required: true } },
    { field: 'quantity', type: 'integer', meta: { required: true } },
    { field: 'added_price', type: 'decimal', meta: { required: true } },
    { field: 'billing_type', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Único', value: 'one_time' }, { text: 'Recorrente', value: 'recurring' },
    ]}}},
    { field: 'created_at', type: 'timestamp' },
  ]) await safeCreateField('Contract_Addendums', f);

  console.log('💰 Financeiro: Consulting_Milestones');
  await safeCreateCollection({ collection: 'Consulting_Milestones', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'value', type: 'decimal', meta: { required: true } },
    { field: 'due_date', type: 'date' },
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Pendente', value: 'pending' }, { text: 'Faturado', value: 'invoiced' },
      { text: 'Pago', value: 'paid' }, { text: 'Atrasado', value: 'overdue' },
    ]}}},
    { field: 'invoice_pdf_path', type: 'string' },
  ]) await safeCreateField('Consulting_Milestones', f);

  console.log('💰 Financeiro: Token_Usage');
  await safeCreateCollection({ collection: 'Token_Usage', schema: {} });
  for (const f of [
    { field: 'virtual_key_id', type: 'string', meta: { required: true } },
    { field: 'workspace_id', type: 'string' },
    { field: 'date', type: 'date', meta: { required: true } },
    { field: 'tokens_input', type: 'integer' },
    { field: 'tokens_output', type: 'integer' },
    { field: 'cost_usd', type: 'decimal' },
    { field: 'model', type: 'string' },
    { field: 'tag', type: 'string' },
  ]) await safeCreateField('Token_Usage', f);

  console.log('💰 Financeiro: Payment_Failures');
  await safeCreateCollection({ collection: 'Payment_Failures', schema: {} });
  for (const f of [
    { field: 'gateway_payment_id', type: 'string' },
    { field: 'failure_reason', type: 'string' },
    { field: 'failed_at', type: 'timestamp' },
    { field: 'dunning_status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Pendente', value: 'pending' }, { text: 'Em andamento', value: 'in_progress' },
      { text: 'Recuperado', value: 'recovered' }, { text: 'Cancelado', value: 'cancelled' },
    ]}}},
  ]) await safeCreateField('Payment_Failures', f);

  console.log('💰 Financeiro: Financial_Snapshots');
  await safeCreateCollection({ collection: 'Financial_Snapshots', schema: {} });
  for (const f of [
    { field: 'snapshot_date', type: 'date', meta: { required: true } },
    { field: 'mrr', type: 'decimal' }, { field: 'new_mrr', type: 'decimal' },
    { field: 'churned_mrr', type: 'decimal' }, { field: 'expansion_mrr', type: 'decimal' },
    { field: 'consulting_revenue', type: 'decimal' }, { field: 'total_revenue', type: 'decimal' },
    { field: 'active_church_clients', type: 'integer' },
    { field: 'new_clients', type: 'integer' }, { field: 'churned_clients', type: 'integer' },
  ]) await safeCreateField('Financial_Snapshots', f);

  // ─── Editorial ────────────────────────────────────────────────────────────

  console.log('✍️  Editorial: Editorial_Pillars');
  await safeCreateCollection({ collection: 'Editorial_Pillars', schema: {}, meta: { display: 'name' } });
  for (const f of [
    { field: 'name', type: 'string', meta: { required: true } },
    { field: 'slug', type: 'string', meta: { required: true } },
    { field: 'trend_keywords', type: 'json' },
    { field: 'min_posts_per_month', type: 'integer', schema: { default_value: 1 } },
    { field: 'target_audience', type: 'text' },
    { field: 'is_active', type: 'boolean', schema: { default_value: true } },
    { field: 'priority_weight', type: 'integer', schema: { default_value: 5 } },
  ]) await safeCreateField('Editorial_Pillars', f);

  console.log('✍️  Editorial: Editorial_Plan');
  await safeCreateCollection({ collection: 'Editorial_Plan', schema: {}, meta: { display: 'title' } });
  for (const f of [
    { field: 'title', type: 'string', meta: { required: true } },
    { field: 'target_keywords', type: 'json' },
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Planejado', value: 'planned' }, { text: 'Em Produção', value: 'in_progress' },
      { text: 'Revisão', value: 'review' }, { text: 'Publicado', value: 'published' },
      { text: 'Arquivado', value: 'archived' },
    ]}}},
    { field: 'scheduled_for', type: 'date' },
    { field: 'content_brief', type: 'text' },
    { field: 'performance_score', type: 'decimal' },
    { field: 'assigned_format', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Artigo', value: 'article' }, { text: 'Thread', value: 'thread' },
      { text: 'Carrossel', value: 'carousel' },
    ]}}},
    { field: 'asset_strategy_override', type: 'string' },
  ]) await safeCreateField('Editorial_Plan', f);

  console.log('✍️  Editorial: Content_Channels');
  await safeCreateCollection({ collection: 'Content_Channels', schema: {}, meta: { display: 'channel' } });
  for (const f of [
    { field: 'channel', type: 'string', meta: { required: true } },
    { field: 'asset_strategy', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'IA Generativa', value: 'ai_generated' },
      { text: 'Template Canva', value: 'canva_template' },
      { text: 'Manual', value: 'manual' },
    ]}}},
    { field: 'canva_template_id', type: 'string' },
    { field: 'ai_image_style', type: 'text' },
    { field: 'ai_image_model', type: 'string' },
    { field: 'tone', type: 'text' },
    { field: 'max_chars', type: 'integer' },
    { field: 'hashtag_count', type: 'integer' },
    { field: 'posting_time', type: 'time' },
    { field: 'is_active', type: 'boolean', schema: { default_value: true } },
  ]) await safeCreateField('Content_Channels', f);

  console.log('✍️  Editorial: Posts');
  await safeCreateCollection({ collection: 'Posts', schema: {}, meta: { display: 'title' } });
  for (const f of [
    { field: 'title', type: 'string', meta: { required: true } },
    { field: 'slug', type: 'string', meta: { required: true } },
    { field: 'body', type: 'text', meta: { interface: 'input-rich-text-md' } },
    { field: 'excerpt', type: 'text' },
    { field: 'meta_title', type: 'string' },
    { field: 'meta_description', type: 'text' },
    { field: 'focus_keyword', type: 'string' },
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Rascunho', value: 'draft' }, { text: 'Revisão', value: 'review' },
      { text: 'Publicado', value: 'published' }, { text: 'Arquivado', value: 'archived' },
    ]}}},
    { field: 'published_at', type: 'timestamp' },
    { field: 'author', type: 'string' },
    { field: 'cover_image_url', type: 'string' },
    { field: 'estimated_read_time', type: 'integer' },
  ]) await safeCreateField('Posts', f);

  // ─── Church Platform ──────────────────────────────────────────────────────

  console.log('⛪ Church: Church_Clients');
  await safeCreateCollection({ collection: 'Church_Clients', schema: {}, meta: { display: 'church_name' } });
  for (const f of [
    { field: 'church_name', type: 'string', meta: { required: true } },
    { field: 'leader_name', type: 'string', meta: { required: true } },
    { field: 'leader_email', type: 'string', meta: { required: true } },
    { field: 'leader_phone', type: 'string' },
    { field: 'city', type: 'string' }, { field: 'state', type: 'string' },
    { field: 'paperclip_workspace_id', type: 'string' },
    { field: 'directus_instance_url', type: 'string' },
    { field: 'n8n_workspace_id', type: 'string' },
    { field: 'onboarding_status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Pendente', value: 'pending' }, { text: 'Dia 0', value: 'day0' },
      { text: 'Dia 2', value: 'day2' }, { text: 'Dia 5', value: 'day5' },
      { text: 'Dia 7', value: 'day7' }, { text: 'Dia 10', value: 'day10' },
      { text: 'Concluído', value: 'completed' },
    ]}}},
    { field: 'last_activity_at', type: 'timestamp' },
    { field: 'churn_risk_score', type: 'integer', schema: { default_value: 0 } },
  ]) await safeCreateField('Church_Clients', f);

  console.log('⛪ Church: Church_Subscriptions');
  await safeCreateCollection({ collection: 'Church_Subscriptions', schema: {} });
  for (const f of [
    { field: 'plan_tier', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Starter', value: 'starter' }, { text: 'Growth', value: 'growth' },
      { text: 'Pro', value: 'pro' }, { text: 'Enterprise', value: 'enterprise' },
    ]}}},
    { field: 'status', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'Trial', value: 'trial' }, { text: 'Ativo', value: 'active' },
      { text: 'Suspenso', value: 'suspended' }, { text: 'Cancelado', value: 'cancelled' },
    ]}}},
    { field: 'module_media_app', type: 'boolean', schema: { default_value: false } },
    { field: 'module_multi_church', type: 'boolean', schema: { default_value: false } },
    { field: 'module_contributor_app', type: 'boolean', schema: { default_value: false } },
    { field: 'module_leader_app', type: 'boolean', schema: { default_value: false } },
    { field: 'module_courses', type: 'boolean', schema: { default_value: false } },
    { field: 'base_price', type: 'decimal' },
    { field: 'addons_price', type: 'decimal', schema: { default_value: 0 } },
    { field: 'next_billing_date', type: 'date' },
    { field: 'gateway_subscription_id', type: 'string' },
  ]) await safeCreateField('Church_Subscriptions', f);

  console.log('⛪ Church: Onboarding_Steps');
  await safeCreateCollection({ collection: 'Onboarding_Steps', schema: {}, meta: { display: 'description' } });
  for (const f of [
    { field: 'step_order', type: 'integer', meta: { required: true } },
    { field: 'day_offset', type: 'integer', meta: { required: true } },
    { field: 'channel', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'WhatsApp', value: 'whatsapp' }, { text: 'Email', value: 'email' },
    ]}}},
    { field: 'subject', type: 'string' },
    { field: 'template_key', type: 'string', meta: { required: true } },
    { field: 'description', type: 'text' },
  ]) await safeCreateField('Onboarding_Steps', f);

  // ─── Company Settings ─────────────────────────────────────────────────────

  console.log('⚙️  Config: Company_Settings');
  await safeCreateCollection({
    collection: 'Company_Settings',
    schema: { primary_key: { field: 'key', type: 'string' } },
    meta: { display: 'key' }
  });
  for (const f of [
    { field: 'value', type: 'text' },
    { field: 'description', type: 'text' },
    { field: 'type', type: 'string', meta: { interface: 'select', options: { choices: [
      { text: 'String', value: 'string' }, { text: 'Inteiro', value: 'integer' },
      { text: 'Booleano', value: 'boolean' }, { text: 'JSON', value: 'json' },
    ]}}},
  ]) await safeCreateField('Company_Settings', f);

  // ─── Seeds obrigatórios ───────────────────────────────────────────────────

  console.log('\n🌱 Inserindo seeds obrigatórios...');

  const settings = [
    { key: 'max_active_projects', value: '5', description: 'Máximo de projetos ativos simultâneos', type: 'integer' },
    { key: 'availability_flag', value: 'available', description: 'Flag de disponibilidade comercial', type: 'string' },
    { key: 'churn_inactivity_warning_days', value: '14', description: 'Dias sem atividade para alerta de churn', type: 'integer' },
    { key: 'churn_inactivity_critical_days', value: '30', description: 'Dias sem atividade para ação de reengajamento', type: 'integer' },
    { key: 'content_scoring_weights', value: '{"organic_clicks":0.4,"shares":0.3,"views":0.2,"comments":0.1}', description: 'Pesos para cálculo de performance score de conteúdo', type: 'json' },
    { key: 'support_escalation_keywords', value: '["fora do ar","erro crítico","perdeu dados","não consigo acessar","sistema parou"]', description: 'Keywords que disparam escalação P1 no OnCallSupport', type: 'json' },
    { key: 'governance_spec_git_ref', value: 'main', description: 'Branch Git de referência para GovernanceAuditor', type: 'string' },
    { key: 'governance_sensitive_field_patterns', value: '["*_token","*_key","*_secret","*_password"]', description: 'Padrões de campos sensíveis auditados pelo GovernanceAuditor', type: 'json' },
    { key: 'top_performing_pillars', value: '[]', description: 'Pilares com melhor performance — atualizado pelo ContentAnalyst', type: 'json' },
  ];

  for (const setting of settings) {
    try {
      await client.request(createItem('Company_Settings', setting));
    } catch (e: any) {
      if (!e.message?.includes('unique')) throw e;
    }
  }

  // Seeds de Gatekeepers
  const gatekeepers = [
    { name: '70% Warning — Cliente', threshold: 70, action: 'notify', channel: 'whatsapp', template_key: 'quota_70_client', applies_to: 'client', is_active: true },
    { name: '90% Soft Block — Cliente', threshold: 90, action: 'soft_block', channel: 'both', template_key: 'quota_90_client', applies_to: 'client', is_active: true },
    { name: '100% Hard Block — Cliente', threshold: 100, action: 'hard_block', channel: 'email', template_key: 'quota_100_client', applies_to: 'client', is_active: true },
    { name: '80% Warning — Interno', threshold: 80, action: 'notify', channel: 'telegram', template_key: 'quota_80_internal', applies_to: 'internal', is_active: true },
  ];
  for (const g of gatekeepers) {
    try { await client.request(createItem('Gatekeepers', g)); } catch {}
  }

  // Seeds de Dunning_Rules
  const dunningRules = [
    { name: 'Dia 0 — Aviso inicial', trigger_days: 0, action: 'notify_client', channel: 'both', template_key: 'dunning_day0', grace_period_hours: 0, is_active: true },
    { name: 'Dia 3 — Retry automático', trigger_days: 3, action: 'retry_payment', channel: 'whatsapp', template_key: 'dunning_day3_retry', grace_period_hours: 0, is_active: true },
    { name: 'Dia 5 — Aviso urgente', trigger_days: 5, action: 'notify_client', channel: 'whatsapp', template_key: 'dunning_day5', grace_period_hours: 0, is_active: true },
    { name: 'Dia 7 — Suspender acesso', trigger_days: 7, action: 'suspend_access', channel: 'email', template_key: 'dunning_day7_suspend', grace_period_hours: 24, is_active: true },
    { name: 'Dia 14 — Cancelar assinatura', trigger_days: 14, action: 'cancel_subscription', channel: 'email', template_key: 'dunning_day14_cancel', grace_period_hours: 0, is_active: true },
  ];
  for (const r of dunningRules) {
    try { await client.request(createItem('Dunning_Rules', r)); } catch {}
  }

  // Seeds de Onboarding_Steps
  const onboardingSteps = [
    { step_order: 1, day_offset: 0, channel: 'whatsapp', template_key: 'onboarding_day0_whatsapp', description: 'Boas-vindas com credenciais de acesso' },
    { step_order: 2, day_offset: 2, channel: 'whatsapp', template_key: 'onboarding_day2_members', description: 'Incentivo a cadastrar membros' },
    { step_order: 3, day_offset: 5, channel: 'email', subject: 'Configurando o financeiro da {church_name}', template_key: 'onboarding_day5_financial', description: 'Guia de configuração financeira' },
    { step_order: 4, day_offset: 7, channel: 'whatsapp', template_key: 'onboarding_day7_checkin', description: 'Check-in de experiência' },
    { step_order: 5, day_offset: 10, channel: 'email', subject: 'Vamos fazer uma call rápida? ☕', template_key: 'onboarding_day10_success_call', description: 'Convite para call de sucesso' },
  ];
  for (const s of onboardingSteps) {
    try { await client.request(createItem('Onboarding_Steps', s)); } catch {}
  }

  console.log('\n🎉 Bootstrap concluído com sucesso!');
  console.log('   Coleções criadas e seeds inseridos.');
  console.log('   Próximo passo: configure os secrets no Paperclip e valide via GovernanceAuditor.');
}

bootstrap().catch(err => {
  console.error('❌ Falha no bootstrap:', err);
  process.exit(1);
});
