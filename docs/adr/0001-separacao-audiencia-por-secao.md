# ADR-0001: Separação de audiência por seção no Playbook

**Status:** Aceito  
**Data:** 2026-05-29

## Contexto

O Playbook serve dois públicos com necessidades radicalmente distintas:

- **Operadores** (equipe 5implis): leem schemas TypeScript, tabelas de 41 agentes, diagramas C4. Precisam de densidade informacional e precisão técnica.
- **Clientes B2B**: empresários com habilidade técnica leve, verificando o que foi construído para eles. Precisam de clareza imediata, sem jargão técnico pesado.

O design atual foi construído com foco no Operador. Clientes chegando em páginas como `/schemas/` encontram conteúdo inacessível.

## Decisão

Separar o conteúdo **por seção dentro do mesmo site**, com tratamento visual e linguagem distintos por audiência:

- **Seções de cliente** (`/onboarding/`, `/agents/` em linguagem de negócio, `/flows/`): linguagem acessível, menor densidade, foco em "o que isso faz pelo meu negócio"
- **Seções de operador** (`/architecture/`, `/schemas/`, `/provisioning/`): densidade técnica, foco em precisão e referência

Objetivo futuro: migrar para dois sites distintos quando o volume de conteúdo justificar.

## Alternativas consideradas

**A) Design unificado mais acessível** — suavizar o sistema inteiro. Rejeitado porque prejudica a legibilidade técnica para Operadores sem resolver o problema de linguagem para Clientes.

## Consequências

- PRODUCT.md e DESIGN.md precisam registrar os dois perfis de audiência explicitamente
- Novas páginas devem declarar sua audiência-alvo no frontmatter
- A hierarquia de navegação do sidebar deve sinalizar visualmente qual seção é qual
