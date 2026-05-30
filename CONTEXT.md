# CONTEXT.md — 5impl.is Playbook

Glossário canônico do domínio. Não contém detalhes de implementação.

---

## Termos

### Operador
Membro interno da equipe 5implis. Engenheiro ou fundador que constrói e opera a plataforma. Lê o Playbook para referência técnica profunda: arquitetura, schemas, agentes, scripts de provisionamento. Alta familiaridade técnica. Contexto de uso: qualquer dos três modos de navegação.

### Cliente B2B
Empresário ou empreendedor com **habilidade técnica leve** — entusiasta digital que quer alavancar automação no próprio negócio, mas não é desenvolvedor. Acessa o Playbook durante onboarding ou engagements ativos para verificar o que foi construído para ele: fluxos, integrações, comportamento de agentes. Não lê schemas ou código diretamente. Contexto de uso: principalmente busca rápida e consulta de referência.

### Três Contextos de Navegação
Modos distintos em que qualquer usuário (Operador ou Cliente B2B) pode estar interagindo com o Playbook em um dado momento:
1. **Busca rápida** — localizar uma informação específica e sair
2. **Aprendizado profundo** — entender um sistema ou fluxo do início ao fim
3. **Consulta recorrente** — verificar um detalhe já conhecido (field name, trigger, endpoint)

### Active Teal (`#00C9A7`)
Cor de acento única do sistema dark. Seu papel é **estado ativo ou interativo** — nunca decorativo. Usado em: links clicáveis, active nav, focus ring, inline code (presença de código). Teal High (`#5EECD4`) é reservado para hover/ênfase sobre Active Teal.

### Domínio Técnico (Playbook)
Site atual. Audiência: Operadores. Conteúdo: arquitetura C4, schemas, agentes, provisionamento. URL futura: `playbook.5implis.com` ou similar.

### Domínio B2B (futuro)
Site a ser criado. Audiência: Clientes B2B. Conteúdo: onboarding, getting started, catálogo de agentes em linguagem de negócio, fluxos explicados sem jargão. Insumos virão do Playbook atual — especialmente `/onboarding/` e `/agents/`. URL futura: `docs.5implis.com` ou similar.

### Label Style
Estilo tipográfico para rótulos curtos de interface: Inter 700, 0.8rem, 0.06em tracking, uppercase, cor Ink Muted (`#6666AA`). Aplicado apenas a: h4, sidebar group headers, thead de tabelas. Limite: 4 palavras. Nunca aplicado a breadcrumbs ou navegação estrutural.
