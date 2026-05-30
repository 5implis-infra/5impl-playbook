# Fluxo: Pipeline de Conteúdo

> Editorial → Aprovação → Publicação → Social → Newsletter

---

## Diagrama de Sequência Completo

```mermaid
sequenceDiagram
  participant N8 as n8n (cron)
  participant EP as EditorialPlanner
  participant MR as MarketResearcher
  participant CW as ContentWriter
  participant SEO as SEOSpecialist
  participant DP as DraftPublisher
  participant ID as ImageDirector
  participant EG as EditorialGatekeeper
  participant S as Sócio (HITL)
  participant SSP as StaticSitePublisher
  participant CF as Cloudflare
  participant SMS as SocialMediaStrategist
  participant LC as LinkedInCopywriter
  participant IC as InstagramCopywriter
  participant NE as NewsletterEditor
  participant ND as NewsletterDispatcher
  participant SMP as SocialMediaPublisher
  participant ZR as Zernio
  participant HM as Hermes

  Note over EP: Cron dia 1 do mês
  EP->>EP: Pesquisa trends + consulta Editorial_Pillars
  EP->>S: Issue HITL: pautas do mês para aprovação
  S->>EP: aprova pautas
  EP->>N8: popula Editorial_Plan no Directus

  Note over N8: Cron semanal por entrada do Editorial_Plan
  N8->>MR: editorial_schedule_triggered {title, keywords, pillar}
  MR->>MR: web_search profundo
  MR->>CW: research_completed {research_brief}
  CW->>CW: escreve artigo em Markdown
  CW->>SEO: article_written {body}
  SEO->>SEO: otimiza metadados, resolve internal links
  SEO->>DP: article_seo_ready {body, meta_*, slug}
  DP->>DP: mapeia schema Posts inteligentemente
  DP->>ID: draft_created {post_id}
  ID->>ID: lê Content_Channels.asset_strategy
  alt ai_generated
    ID->>ID: crafts image prompt
    ID->>ID: chama LiteLLM → DALL-E/Ideogram
  else canva_template
    ID->>N8: HTTP trigger → n8n → Canva API
    N8->>ID: asset_url
  end
  ID->>EG: draft_created + assets_ready
  EG->>S: Issue HITL + WhatsApp: "Post pronto para revisão"
  S->>EG: aprova
  EG->>SSP: content_approved
  SSP->>SSP: atualiza Posts.status = published
  SSP->>CF: POST build webhook
  CF-->>SSP: build confirmado
  SSP->>SMS: content_published
  SSP->>NE: content_published

  par Time Social
    SMS->>LC: brief LinkedIn
    SMS->>IC: brief Instagram
    LC->>EG: linkedin_post_ready
    IC->>EG: instagram_post_ready
    EG->>S: Issue HITL: "Posts sociais para aprovação"
    S->>EG: aprova
    EG->>SMP: social_approved
    SMP->>ZR: publica posts agendados
  and Newsletter
    NE->>ND: newsletter_ready {subject, preheader, excerpt, cta}
    ND->>ND: segmenta lista por vertical
    ND->>HM: envia em lote
  end
```

---

## Payloads de Transferência

### `editorial_schedule_triggered`
```json
{
  "plan_entry_id": "uuid",
  "title": "Como automatizar o onboarding de clientes em 2025",
  "pillar": "automation",
  "target_keywords": ["onboarding automático", "automação B2B"],
  "content_brief": "Focar em casos práticos com n8n e Paperclip",
  "scheduled_for": "2025-06-15",
  "format": "article"
}
```

### `research_completed`
```json
{
  "plan_entry_id": "uuid",
  "research_brief": {
    "overview": "...",
    "key_stats": ["X% das empresas...", "Estudo Y mostra..."],
    "expert_angles": ["..."],
    "practical_examples": ["..."],
    "sources": ["url1", "url2"]
  }
}
```

### `article_seo_ready`
```json
{
  "plan_entry_id": "uuid",
  "title": "...",
  "body": "## Markdown completo...",
  "slug": "como-automatizar-onboarding-clientes-2025",
  "meta_title": "Como automatizar onboarding de clientes | 5impl",
  "meta_description": "Guia prático de automação de onboarding...",
  "focus_keyword": "automação de onboarding",
  "estimated_read_time": 8,
  "internal_links": [{ "text": "saiba mais sobre n8n", "slug": "o-que-e-n8n" }]
}
```

### `draft_created`
```json
{
  "post_id": "uuid",
  "title": "...",
  "slug": "...",
  "directus_url": "https://directus.5impl.is/items/posts/uuid"
}
```

### `content_published`
```json
{
  "post_id": "uuid",
  "title": "...",
  "url": "https://5impl.is/pt/blog/como-automatizar-onboarding-clientes-2025",
  "published_at": "2025-06-15T10:00:00Z",
  "pillar": "automation",
  "excerpt": "..."
}
```

---

## Tratamento de Erros

| Ponto de Falha | Comportamento |
|---|---|
| `MarketResearcher` sem resultados | Retorna `research_brief` parcial com flag `low_confidence`; `ContentWriter` usa brief disponível |
| `ImageDirector` falha no DALL-E | Tenta modelo alternativo (Ideogram); se falhar → usa imagem placeholder do pilar |
| Build Cloudflare falha | `StaticSitePublisher` cria issue no Paperclip + Telegram ao Sócio; post permanece `published` no Directus |
| `EditorialGatekeeper` recebe `declined` | Notifica agente anterior com feedback; cria sub-issue de revisão |
| Zernio API indisponível | `SocialMediaPublisher` cria issue de retry + agenda nova tentativa via n8n |
